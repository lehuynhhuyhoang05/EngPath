import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const appUrl = process.env.ENGPATH_E2E_URL ?? 'http://localhost:8082';
const port = Number(process.env.ENGPATH_E2E_CDP_PORT ?? 9322);
const windowSize = process.env.ENGPATH_E2E_WINDOW_SIZE ?? '420,860';
const cdpVersionUrl = `http://127.0.0.1:${port}/json/version`;
const cdpListUrl = `http://127.0.0.1:${port}/json/list`;

function browserCandidates() {
  if (process.platform === 'win32') {
    return [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ];
  }
  if (process.platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ];
  }
  return ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge'];
}

async function waitForJson(url, timeoutMs = 15_000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function waitForHttp(url, timeoutMs = 15_000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function waitForPageWs(timeoutMs = 15_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const pages = await waitForJson(cdpListUrl, 1_000).catch(() => []);
    const page = pages.find((entry) => entry.type === 'page' && entry.webSocketDebuggerUrl);
    if (page) return page.webSocketDebuggerUrl;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for a browser page target');
}

async function connectToPage(wsUrl, notifications = []) {
  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id && message.method === 'Runtime.exceptionThrown') {
      notifications.push(message);
    }
    if (!message.id) return;
    const callbacks = pending.get(message.id);
    if (!callbacks) return;
    pending.delete(message.id);
    if (message.error) callbacks.reject(new Error(message.error.message));
    else callbacks.resolve(message.result);
  });

  return {
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed');
  }
  return result.result.value;
}

async function waitFor(client, expression, description, timeoutMs = 10_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await evaluate(client, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for ${description}`);
}

async function clickText(client, text) {
  const clicked = await evaluate(client, `
    (() => {
      const leaf = [...document.querySelectorAll('*')]
        .filter((node) => node.children.length === 0)
        .find((node) => (node.textContent || '').trim() === ${JSON.stringify(text)});
      const target = leaf?.closest('[role="button"], [role="radio"], [role="tab"]') ?? leaf;
      if (!target) return false;
      target.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error(`Could not click text: ${text}`);
}

async function clickContains(client, text) {
  const clicked = await evaluate(client, `
    (() => {
      const leaf = [...document.querySelectorAll('*')]
        .filter((node) => node.children.length === 0)
        .find((node) => (node.textContent || '').includes(${JSON.stringify(text)}));
      const target = leaf?.closest('[role="button"], [role="radio"], [role="tab"]') ?? leaf;
      if (!target) return false;
      target.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error(`Could not click text containing: ${text}`);
}

async function expectText(client, text) {
  await waitFor(client, `document.body.innerText.includes(${JSON.stringify(text)})`, text);
}

async function assertNoHorizontalOverflow(client) {
  const overflow = await evaluate(client, `
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) >
      Math.max(document.documentElement.clientWidth, window.innerWidth) + 1
  `);
  if (overflow) throw new Error('Page has horizontal overflow');
}

async function bodyText(client) {
  return evaluate(client, 'document.body.textContent');
}

async function runFlow(client) {
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.navigate', { url: appUrl });
  await waitFor(client, 'document.readyState === "complete"', 'page load');
  await evaluate(client, 'localStorage.clear(); sessionStorage.clear(); location.reload(); true');
  await waitFor(client, 'document.readyState === "complete"', 'page reload');

  await expectText(client, 'Hôm nay em muốn tiến bộ điều gì?');
  await clickText(client, 'Tiếp tục');
  await expectText(client, 'Bắt đầu chẩn đoán');
  await clickText(client, 'Bắt đầu chẩn đoán');
  await expectText(client, 'Câu 1/');
  await clickContains(client, 'does');
  await clickText(client, 'Câu tiếp theo');
  await clickText(client, 'Thoát');
  await expectText(client, 'Tiếp tục chẩn đoán');
  await clickText(client, 'Tiếp tục chẩn đoán');
  await expectText(client, 'Câu 2/');
  await evaluate(client, 'location.reload(); true');
  await waitFor(client, 'document.readyState === "complete"', 'diagnostic reload');
  await expectText(client, 'Câu 2/');

  for (let question = 2; question <= 9; question += 1) {
    await clickText(client, 'Em chưa biết');
    await clickText(client, question === 9 ? 'Xem định hướng' : 'Câu tiếp theo');
  }

  await expectText(client, 'Bài đầu tiên:');
  await clickText(client, 'Bắt đầu nhiệm vụ đầu tiên');
  await expectText(client, 'Kiểm tra đáp án');
  await clickText(client, 'is');
  await evaluate(client, 'location.reload(); true');
  await waitFor(client, 'document.readyState === "complete"', 'lesson draft reload');
  await expectText(client, 'Kiểm tra đáp án');
  await clickText(client, 'Kiểm tra đáp án');
  await expectText(client, 'Mình sửa chỗ này nhé');
  await clickText(client, 'Hoàn thành bài');
  await expectText(client, 'Ôn lỗi sai');
  await clickText(client, 'Ôn lỗi sai');
  await expectText(client, 'Sổ lỗi sai');
  await expectText(client, 'Em chọn:');
  await clickText(client, 'Ôn lại bài này');
  await expectText(client, 'Kiểm tra đáp án');
  await clickText(client, 'are');
  await clickText(client, 'Kiểm tra đáp án');
  await expectText(client, 'Đúng rồi');
  await clickText(client, 'Hoàn thành bài');
  await clickText(client, 'Luyện');
  await expectText(client, 'Sổ lỗi sai');
  await expectText(client, 'Trống');
  await clickText(client, 'Tiến độ');
  await expectText(client, 'Em đang học đến đâu?');
  await clickText(client, 'Luyện');
  await clickText(client, 'Luyện âm /θ/');
  await expectText(client, 'Mô phỏng UX');
  await clickText(client, 'Nghe mẫu');
  await clickText(client, 'Thu bản thử');
  await waitFor(client, 'document.body.innerText.includes("Đang mô phỏng thu âm") || document.body.innerText.includes("Dừng bản thu mô phỏng")', 'recording state', 4_000);
  await clickText(client, 'Dừng bản thu mô phỏng');
  await clickText(client, 'Xem phản hồi mô phỏng');
  await expectText(client, 'Gần đúng');
  await clickText(client, 'Hoàn thành');
  await expectText(client, 'Phát âm và ôn lỗi sai');
  await assertNoHorizontalOverflow(client);
}

async function main() {
  await waitForHttp(appUrl, 5_000);

  const userDataDir = await mkdtemp(path.join(tmpdir(), 'engpath-e2e-'));
  let browser;
  let lastError;
  for (const executable of browserCandidates()) {
    try {
      browser = spawn(executable, [
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${userDataDir}`,
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        `--window-size=${windowSize}`,
        appUrl,
      ], { stdio: 'ignore' });
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!browser) throw lastError ?? new Error('No supported browser executable found');

  let client;
  const notifications = [];
  try {
    await waitForJson(cdpVersionUrl);
    client = await connectToPage(await waitForPageWs(), notifications);
    try {
      await runFlow(client);
      if (notifications.length) throw new Error(`Browser runtime exceptions: ${JSON.stringify(notifications.slice(-3))}`);
    } catch (error) {
      console.error(await bodyText(client).catch(() => 'Could not read page body'));
      if (notifications.length) console.error(JSON.stringify(notifications.slice(-3), null, 2));
      throw error;
    }
    console.log('EngPath web E2E smoke passed');
  } finally {
    try {
      await client?.send('Browser.close');
    } catch {
      client?.close();
      browser.kill();
    }
    await new Promise((resolve) => browser.once('exit', resolve));
    await rm(userDataDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
