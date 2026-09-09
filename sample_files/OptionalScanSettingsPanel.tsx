import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  CountryID,
  type FieldType,
  type RedactionSettings,
} from "@microblink/blinkid-react-native";
import { ScanningModulesConfig } from "./ScanningModulesConfig";
import {
  REDACTION_MODES,
  SAMPLE_COUNTRIES,
  SAMPLE_DOCUMENT_TYPES,
  SAMPLE_REDACTION_FIELDS,
  SAMPLE_USA_REGIONS,
  emptyUiDocumentFilter,
  type UiDocumentFilter,
} from "./SampleFilterOptions";
import {
  BoolSettingTile,
  EnumDropdown,
  IntSettingField,
  ModuleCard,
  OptionalEnumDropdown,
  SectionLabel,
  StringSettingField,
} from "./SampleUiComponents";

type Props = {
  config: ScanningModulesConfig;
  onChanged: () => void;
};

export function OptionalScanSettingsPanel({ config, onChanged }: Props) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Optional scan settings</Text>
      <Text style={styles.hint}>
        Class filter and redaction apply per scan type. Disabled options are not
        sent to the SDK.
      </Text>

      <ClassFilterCard config={config} onChanged={onChanged} />
      <RedactionResolverCard config={config} onChanged={onChanged} />
      <DirectApiRedactionCard config={config} onChanged={onChanged} />
      <OtaResourcesCard config={config} onChanged={onChanged} />
    </View>
  );
}

function ClassFilterCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  return (
    <ModuleCard
      title="Class filter"
      subtitle={
        config.classFilterEnabled
          ? "Enabled — Scan with camera"
          : "Disabled (null)"
      }
      enabled={config.classFilterEnabled}
      onEnabledChanged={(enabled) => {
        config.classFilterEnabled = enabled;
        onChanged();
      }}
    >
      <Text style={styles.cardHint}>
        Controls which documents are accepted or rejected during camera
        scanning. Include rules restrict to listed classes; exclude rules reject
        listed classes.
      </Text>
      <DocumentFilterListEditor
        title="Include documents"
        rules={config.classFilterInclude}
        onRulesChanged={(rules) => {
          config.classFilterInclude = rules;
          onChanged();
        }}
      />
      <DocumentFilterListEditor
        title="Exclude documents"
        rules={config.classFilterExclude}
        onRulesChanged={(rules) => {
          config.classFilterExclude = rules;
          onChanged();
        }}
      />
    </ModuleCard>
  );
}

function RedactionResolverCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  return (
    <ModuleCard
      title="Redaction resolver"
      subtitle={
        config.redactionResolverEnabled
          ? "Enabled — Scan with camera"
          : "Disabled (null)"
      }
      enabled={config.redactionResolverEnabled}
      onEnabledChanged={(enabled) => {
        config.redactionResolverEnabled = enabled;
        onChanged();
      }}
    >
      <Text style={styles.cardHint}>
        Per-document redaction rules evaluated before the camera scan result is
        finalized. The first matching entry is applied.
      </Text>
      <RedactionSettingsListEditor
        entries={config.redactionResolverEntries}
        onEntriesChanged={(entries) => {
          config.redactionResolverEntries = entries;
          onChanged();
        }}
      />
    </ModuleCard>
  );
}

function OtaResourcesCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  return (
    <ModuleCard
      title="OTA resources download"
      subtitle={
        config.otaResourcesDownload
          ? "Enabled — SDK initialization"
          : "Disabled (null)"
      }
      enabled={config.otaResourcesDownload}
      onEnabledChanged={(enabled) => {
        config.otaResourcesDownload = enabled;
        onChanged();
      }}
    >
      <Text style={styles.cardHint}>
        Enables over-the-air document resource download during SDK
        initialization. When disabled, OTA settings are not sent to the SDK.
      </Text>
      <StringSettingField
        label="Service URL"
        value={config.otaResourcesServiceUrl}
        placeholder="https://blinkid-ota.microblink.com"
        onChanged={(serviceUrl) => {
          config.otaResourcesServiceUrl = serviceUrl;
          onChanged();
        }}
      />
      <BoolSettingTile
        title="Strict"
        value={config.otaResourcesStrict}
        onChanged={(otaResourcesStrict) => {
          config.otaResourcesStrict = otaResourcesStrict;
          onChanged();
        }}
      />
    </ModuleCard>
  );
}

function DirectApiRedactionCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  return (
    <ModuleCard
      title="Redaction settings"
      subtitle={
        config.directApiRedactionEnabled
          ? "Enabled — DirectAPI scans"
          : "Disabled (null)"
      }
      enabled={config.directApiRedactionEnabled}
      onEnabledChanged={(enabled) => {
        config.directApiRedactionEnabled = enabled;
        onChanged();
      }}
    >
      <Text style={styles.cardHint}>
        Single redaction configuration applied to DirectAPI MultiSide and
        SingleSide scans.
      </Text>
      <RedactionSettingsEditor
        title="DirectAPI redaction"
        settings={config.directApiRedaction}
        onSettingsChanged={(settings) => {
          config.directApiRedaction = settings;
          onChanged();
        }}
      />
    </ModuleCard>
  );
}

function DocumentFilterListEditor({
  title,
  rules,
  onRulesChanged,
}: {
  title: string;
  rules: UiDocumentFilter[];
  onRulesChanged: (rules: UiDocumentFilter[]) => void;
}) {
  const updateRule = (index: number, rule: UiDocumentFilter) => {
    const next = [...rules];
    next[index] = rule;
    onRulesChanged(next);
  };

  const removeRule = (index: number) => {
    onRulesChanged(rules.filter((_, i) => i !== index));
  };

  const addRule = () => {
    onRulesChanged([...rules, emptyUiDocumentFilter()]);
  };

  return (
    <View style={styles.listSection}>
      <Text style={styles.listTitle}>{title}</Text>
      {rules.length === 0 ? (
        <Text style={styles.emptyList}>No rules configured.</Text>
      ) : (
        rules.map((rule, index) => (
          <View key={`${title}-${index}`} style={styles.listItemCard}>
            <Text style={styles.listItemTitle}>Rule {index + 1}</Text>
            <DocumentFilterRuleEditor
              rule={rule}
              onChanged={(updated) => updateRule(index, updated)}
            />
            <Pressable
              style={[styles.listActionButton, styles.removeButton]}
              onPress={() => removeRule(index)}
            >
              <Text style={styles.removeButtonText}>Remove rule</Text>
            </Pressable>
          </View>
        ))
      )}
      <Pressable style={styles.listActionButton} onPress={addRule}>
        <Text style={styles.listActionText}>Add rule</Text>
      </Pressable>
    </View>
  );
}

function DocumentFilterRuleEditor({
  rule,
  onChanged,
}: {
  rule: UiDocumentFilter;
  onChanged: (rule: UiDocumentFilter) => void;
}) {
  const regionOptions =
    rule.country === CountryID.USA ? SAMPLE_USA_REGIONS : [];

  return (
    <View>
      <OptionalEnumDropdown
        label="Country"
        value={rule.country}
        options={SAMPLE_COUNTRIES}
        onChanged={(country) =>
          onChanged({
            country,
            region: country === rule.country ? rule.region : undefined,
            documentType: rule.documentType,
          })
        }
      />
      {regionOptions.length > 0 ? (
        <OptionalEnumDropdown
          label="Region"
          value={rule.region}
          options={regionOptions}
          onChanged={(region) => onChanged({ ...rule, region })}
        />
      ) : null}
      <OptionalEnumDropdown
        label="Document type"
        value={rule.documentType}
        options={SAMPLE_DOCUMENT_TYPES}
        onChanged={(documentType) => onChanged({ ...rule, documentType })}
      />
    </View>
  );
}

function RedactionSettingsListEditor({
  entries,
  onEntriesChanged,
}: {
  entries: RedactionSettings[];
  onEntriesChanged: (entries: RedactionSettings[]) => void;
}) {
  const updateEntry = (index: number, entry: RedactionSettings) => {
    const next = [...entries];
    next[index] = entry;
    onEntriesChanged(next);
  };

  const removeEntry = (index: number) => {
    onEntriesChanged(entries.filter((_, i) => i !== index));
  };

  const addEntry = () => {
    onEntriesChanged([
      ...entries,
      ScanningModulesConfig.defaultRedactionSettings(),
    ]);
  };

  return (
    <View style={styles.listSection}>
      {entries.map((entry, index) => (
        <View key={`redaction-${index}`} style={styles.listItemCard}>
          <Text style={styles.listItemTitle}>Entry {index + 1}</Text>
          <RedactionSettingsEditor
            settings={entry}
            onSettingsChanged={(updated) => updateEntry(index, updated)}
          />
          {entries.length > 1 ? (
            <Pressable
              style={[styles.listActionButton, styles.removeButton]}
              onPress={() => removeEntry(index)}
            >
              <Text style={styles.removeButtonText}>Remove entry</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      <Pressable style={styles.listActionButton} onPress={addEntry}>
        <Text style={styles.listActionText}>Add entry</Text>
      </Pressable>
    </View>
  );
}

function RedactionSettingsEditor({
  title,
  settings,
  onSettingsChanged,
}: {
  title?: string;
  settings: RedactionSettings;
  onSettingsChanged: (settings: RedactionSettings) => void;
}) {
  const update = (partial: Partial<RedactionSettings>) => {
    onSettingsChanged({ ...settings, ...partial });
  };

  const updateDocumentFilter = (partial: UiDocumentFilter) => {
    const current = settings.documentFilter ?? {};
    const next = { ...current, ...partial };
    const hasFilter = !!(next.country || next.region || next.documentType);
    update({ documentFilter: hasFilter ? next : undefined });
  };

  const toggleField = (field: FieldType, enabled: boolean) => {
    const fields = new Set(settings.fields);
    if (enabled) {
      fields.add(field);
    } else {
      fields.delete(field);
    }
    update({ fields: Array.from(fields) });
  };

  const prefixDigits =
    settings.documentNumberRedactionSettings?.prefixDigitsVisible ?? 0;
  const suffixDigits =
    settings.documentNumberRedactionSettings?.suffixDigitsVisible ?? 0;

  return (
    <View>
      {title ? <Text style={styles.listItemTitle}>{title}</Text> : null}
      <EnumDropdown
        label="Redaction mode"
        value={settings.mode}
        options={REDACTION_MODES}
        onChanged={(mode) => update({ mode })}
      />
      <SectionLabel text="Fields to anonymize" />
      {SAMPLE_REDACTION_FIELDS.map((field) => (
        <BoolSettingTile
          key={field}
          title={field}
          value={settings.fields.includes(field)}
          onChanged={(enabled) => toggleField(field, enabled)}
        />
      ))}
      <SectionLabel text="Document number redaction" />
      <IntSettingField
        label="Prefix digits visible"
        value={prefixDigits}
        min={0}
        max={20}
        onChanged={(prefixDigitsVisible) =>
          update({
            documentNumberRedactionSettings: {
              ...settings.documentNumberRedactionSettings,
              prefixDigitsVisible,
              suffixDigitsVisible: suffixDigits,
            },
          })
        }
      />
      <IntSettingField
        label="Suffix digits visible"
        value={suffixDigits}
        min={0}
        max={20}
        onChanged={(suffixDigitsVisible) =>
          update({
            documentNumberRedactionSettings: {
              ...settings.documentNumberRedactionSettings,
              prefixDigitsVisible: prefixDigits,
              suffixDigitsVisible,
            },
          })
        }
      />
      <BoolSettingTile
        title="Redact MRZ result"
        value={settings.redactMrzResult}
        onChanged={(redactMrzResult) => update({ redactMrzResult })}
      />
      <BoolSettingTile
        title="Redact barcode result"
        value={settings.redactBarcodeResult}
        onChanged={(redactBarcodeResult) => update({ redactBarcodeResult })}
      />
      <SectionLabel text="Document filter (match target)" />
      <DocumentFilterRuleEditor
        rule={{
          country: settings.documentFilter?.country,
          region: settings.documentFilter?.region,
          documentType: settings.documentFilter?.documentType,
        }}
        onChanged={updateDocumentFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { marginTop: 8, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "600", color: "#1565C0" },
  hint: { fontSize: 12, color: "#666", marginTop: 4, marginBottom: 12 },
  cardHint: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  listSection: { marginBottom: 8 },
  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  emptyList: {
    fontSize: 12,
    color: "#888",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  listItemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  listActionButton: {
    alignSelf: "flex-end",
    marginHorizontal: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#1565C0",
  },
  listActionText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  removeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c62828",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  removeButtonText: { color: "#c62828", fontSize: 13, fontWeight: "600" },
});
