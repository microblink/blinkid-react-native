import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

export function BoolSettingTile({
  title,
  subtitle,
  value,
  onChanged,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onChanged: (value: boolean) => void;
}) {
  return (
    <View style={styles.boolRow}>
      <View style={styles.boolText}>
        <Text style={styles.boolTitle}>{title}</Text>
        {subtitle ? <Text style={styles.boolSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChanged} />
    </View>
  );
}

export function EnumDropdown<T extends string>({
  label,
  value,
  options,
  onChanged,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChanged: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={() => setOpen(true)}>
        <Text>{value}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalSheet}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  onChanged(option);
                  setOpen(false);
                }}
              >
                <Text
                  style={
                    option === value ? styles.modalOptionSelected : undefined
                  }
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function OptionalEnumDropdown<T extends string>({
  label,
  value,
  options,
  onChanged,
}: {
  label: string;
  value?: T;
  options: readonly T[];
  onChanged: (value: T | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const displayValue = value ?? "None";

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={() => setOpen(true)}>
        <Text>{displayValue}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalSheet}>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                onChanged(undefined);
                setOpen(false);
              }}
            >
              <Text
                style={
                  value === undefined ? styles.modalOptionSelected : undefined
                }
              >
                None
              </Text>
            </Pressable>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  onChanged(option);
                  setOpen(false);
                }}
              >
                <Text
                  style={
                    option === value ? styles.modalOptionSelected : undefined
                  }
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function StringSettingField({
  label,
  value,
  onChanged,
  placeholder,
}: {
  label: string;
  value: string;
  onChanged: (value: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const commit = () => {
    onChanged(text.trim());
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder={placeholder}
        returnKeyType="done"
        onSubmitEditing={commit}
        onBlur={commit}
      />
    </View>
  );
}

export function IntSettingField({
  label,
  value,
  min,
  max,
  onChanged,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChanged: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    const parsed = parseInt(text, 10);
    if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
      onChanged(parsed);
    } else {
      setText(String(value));
    }
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={commit}
        onBlur={commit}
      />
      <Text style={styles.helperText}>
        {min}–{max}
      </Text>
    </View>
  );
}

export function DoubleSettingField({
  label,
  value,
  min,
  max,
  onChanged,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChanged: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    const parsed = parseFloat(text);
    if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
      onChanged(parsed);
    } else {
      setText(String(value));
    }
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        keyboardType="decimal-pad"
        returnKeyType="done"
        onSubmitEditing={commit}
        onBlur={commit}
      />
      <Text style={styles.helperText}>
        {min}–{max}
      </Text>
    </View>
  );
}

export function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function ModuleCard({
  title,
  subtitle,
  enabled,
  onEnabledChanged,
  children,
}: {
  title: string;
  subtitle?: string;
  enabled: boolean;
  onEnabledChanged: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[styles.moduleCard, !enabled && styles.moduleCardDisabled]}
    >
      <View style={styles.moduleHeader}>
        <Pressable
          style={styles.moduleTitleArea}
          onPress={() => enabled && setExpanded((e) => !e)}
          disabled={!enabled}
        >
          <View style={styles.moduleTitleRow}>
            <Text
              style={[
                styles.expandChevron,
                !enabled && styles.disabledText,
                expanded && styles.expandChevronOpen,
              ]}
            >
              ›
            </Text>
            <View style={styles.moduleTitleText}>
              <Text style={[styles.cardTitle, !enabled && styles.disabledText]}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
              ) : null}
              {enabled ? (
                <Text style={styles.expandHint}>
                  {expanded ? "Tap to collapse" : "Tap to expand settings"}
                </Text>
              ) : null}
            </View>
          </View>
        </Pressable>
        <Switch value={enabled} onValueChange={onEnabledChanged} />
      </View>
      {enabled && expanded ? (
        <View style={styles.moduleBody}>{children}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1565C0",
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  boolRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  boolText: { flex: 1, marginRight: 8 },
  boolTitle: { fontSize: 15 },
  boolSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  fieldWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  fieldLabel: { fontSize: 13, color: "#444", marginBottom: 4 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  helperText: { fontSize: 11, color: "#888", marginTop: 2 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  modalOptionSelected: { fontWeight: "600", color: "#1565C0" },
  card: {
    backgroundColor: "#E8EEF5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  moduleCard: {
    backgroundColor: "#EEF2F6",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  moduleCardDisabled: { backgroundColor: "#E0E0E0", opacity: 0.85 },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  moduleTitleArea: { flex: 1, marginRight: 8 },
  moduleTitleRow: { flexDirection: "row", alignItems: "flex-start" },
  moduleTitleText: { flex: 1 },
  expandChevron: {
    fontSize: 22,
    lineHeight: 24,
    color: "#1565C0",
    marginRight: 6,
    marginTop: -1,
  },
  expandChevronOpen: { transform: [{ rotate: "90deg" }] },
  moduleBody: { paddingHorizontal: 4, paddingBottom: 12 },
  expandHint: { fontSize: 11, color: "#888", marginTop: 4 },
  disabledText: { color: "#999" },
});
