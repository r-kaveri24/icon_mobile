import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { Ionicons } from '@expo/vector-icons';

type AgentRequestNavProp = StackNavigationProp<RootStackParamList, 'AgentRequest'>;

interface Props {
  navigation: AgentRequestNavProp;
}

const CATEGORY_OPTIONS = [
  { key: 'cctv', label: 'CCTV', icon: 'videocam-outline' as const, sub: [
    'No video feed', 'Blurry image', 'Night vision not working', 'Recording failure', 'Power issue', 'Network disconnect', 'Other'
  ] },
  { key: 'laptop', label: 'Laptop', icon: 'laptop-outline' as const, sub: [
    'Won’t turn on', 'Battery drains fast', 'Screen flicker', 'Keyboard not working', 'Overheating', 'Slow performance', 'Other'
  ] },
  { key: 'computer', label: 'Computer', icon: 'tv-outline' as const, sub: [
    'Boot failure', 'Blue screen', 'No display', 'USB ports not working', 'Network issue', 'Frequent crashes', 'Other'
  ] },
  { key: 'other', label: 'Other', icon: 'construct-outline' as const, sub: [] },
];

export default function AgentRequestScreen({ navigation }: Props) {
  const [category, setCategory] = React.useState<string | null>(null);
  const [issue, setIssue] = React.useState<string | null>(null);
  const [otherText, setOtherText] = React.useState('');
  const scrollRef = React.useRef<ScrollView>(null);

  const onSelectCategory = (key: string) => {
    setCategory(key);
    setIssue(null);
    if (key !== 'other') setOtherText('');
  };

  const current = CATEGORY_OPTIONS.find(c => c.key === category);
  const canSubmit = !!category && (
    category === 'other'
      ? otherText.trim().length > 0
      : !!issue && (issue === 'Other' ? otherText.trim().length > 0 : true)
  );

  const submit = () => {
    // For now, navigate to AgentStatus as confirmation
    navigation.navigate('AgentStatus', { requestId: 'mock-' + Date.now() });
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={64}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
          ref={scrollRef}
        >
          <Text variant="h2" style={styles.title}>Book Agent</Text>
          <Text variant="caption" color="#666" style={styles.subtitle}>Select a category and issue to proceed</Text>

          <View style={styles.categoriesRow}>
            {CATEGORY_OPTIONS.map(opt => {
              const selected = category === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.catChip, selected && styles.catChipSelected]} onPress={() => onSelectCategory(opt.key)} accessibilityLabel={`Select ${opt.label}`}>
                  <Ionicons name={opt.icon} size={18} color={selected ? '#FAF8F2' : '#2E2E2E'} />
                  <Text
                    variant="caption"
                    style={StyleSheet.flatten([styles.catLabel, selected && styles.catLabelSelected])}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {category && category !== 'other' && (
            <View style={styles.subList}>
              {current?.sub.map(s => {
                const selected = issue === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.subItem, selected && styles.subItemSelected]}
                    onPress={() => {
                      setIssue(s);
                      if (s !== 'Other') setOtherText('');
                    }}
                    accessibilityLabel={`Select issue ${s}`}
                  >
                    <Ionicons name={selected ? 'checkmark-circle-outline' : 'ellipse-outline'} size={18} color={selected ? '#2C5AA0' : '#2E2E2E'} />
                    <Text variant="body" style={styles.subText}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {category && category !== 'other' && issue === 'Other' && (
            <View style={styles.otherBox}>
              <Text variant="body" style={styles.otherLabel}>Describe your issue</Text>
              <TextInput
                placeholder="Type your issue..."
                placeholderTextColor="#888"
                value={otherText}
                onChangeText={setOtherText}
                style={styles.input}
                multiline
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
          )}

          {category === 'other' && (
            <View style={styles.otherBox}>
              <Text variant="body" style={styles.otherLabel}>Describe your issue</Text>
              <TextInput
                placeholder="Type your issue..."
                placeholderTextColor="#888"
                value={otherText}
                onChangeText={setOtherText}
                style={styles.input}
                multiline
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
          )}

          <View style={styles.actions}>
            <Button title="Submit Request" onPress={submit} disabled={!canSubmit} />
            <View style={{ height: 8 }} />
            <Button title="Back to Agent Hub" onPress={() => navigation.navigate('AgentHub')} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    color: '#2E2E2E',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  catChipSelected: {
    backgroundColor: '#2C5AA0',
    borderColor: '#2C5AA0',
  },
  catLabel: {
    color: '#2E2E2E',
  },
  catLabelSelected: {
    color: '#FAF8F2',
    fontWeight: '600',
  },
  subList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 12,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  subItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  subText: {
    marginLeft: 8,
    color: '#2E2E2E',
  },
  otherBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },
  otherLabel: {
    marginBottom: 6,
    color: '#2E2E2E',
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#2E2E2E',
    backgroundColor: '#FFFFFF',
  },
  actions: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});