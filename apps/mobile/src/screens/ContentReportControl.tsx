import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ContentReportReason } from '../domain/models';
import { TextButton } from '../ui/components';
import { colors, spacing, type } from '../ui/theme';

export function ContentReportControl({ kind, hasReport, onReport }: {
  kind: 'question' | 'pronunciation';
  hasReport: boolean;
  onReport: (reason: ContentReportReason) => void;
}) {
  const [open, setOpen] = useState(false);
  if (hasReport) return <Text accessibilityLiveRegion="polite" style={styles.reported}>Đã lưu báo cáo trên máy. Báo cáo chưa được gửi cho đội nội dung.</Text>;
  if (!open) return <TextButton label="Báo nội dung có vấn đề" onPress={() => setOpen(true)} />;

  return (
    <View style={styles.options}>
      <Text style={styles.prompt}>Em thấy vấn đề ở đâu?</Text>
      {kind === 'question' ? <TextButton label="Đáp án có thể sai" onPress={() => onReport('answer')} /> : <TextButton label="Câu luyện có vấn đề" onPress={() => onReport('prompt')} />}
      <TextButton label={kind === 'question' ? 'Giải thích khó hiểu' : 'Mẹo phát âm khó hiểu'} onPress={() => onReport('explanation')} />
      <TextButton label="Lỗi chính tả" onPress={() => onReport('typo')} />
      <TextButton label="Hủy" onPress={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  reported: { ...type.caption, color: colors.inkSoft, textAlign: 'center', paddingVertical: spacing.md },
  options: { borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: spacing.md },
  prompt: { ...type.bodyStrong, color: colors.inkSoft, textAlign: 'center' },
});
