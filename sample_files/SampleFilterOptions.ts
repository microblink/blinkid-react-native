import {
  CountryID,
  DocumentTypeID,
  FieldType,
  RegionID,
  type DocumentFilter,
  type FieldType as FieldTypeValue,
  type RedactionMode,
} from "@microblink/blinkid-react-native";

export type UiDocumentFilter = {
  country?: CountryID;
  region?: RegionID;
  documentType?: DocumentTypeID;
};

export const SAMPLE_COUNTRIES: CountryID[] = [
  CountryID.Canada,
  CountryID.USA,
  CountryID.Croatia,
  CountryID.Germany,
  CountryID.UK,
  CountryID.Australia,
];

export const SAMPLE_USA_REGIONS: RegionID[] = [
  RegionID.California,
  RegionID.Texas,
  RegionID.NewYork,
  RegionID.Florida,
];

export const SAMPLE_DOCUMENT_TYPES: DocumentTypeID[] = [
  DocumentTypeID.Id,
  DocumentTypeID.Dl,
  DocumentTypeID.Passport,
  DocumentTypeID.Visa,
];

export const REDACTION_MODES: RedactionMode[] = [
  "none",
  "imageOnly",
  "resultFieldsOnly",
  "fullResult",
];

export const SAMPLE_REDACTION_FIELDS: FieldTypeValue[] = [
  FieldType.FirstName,
  FieldType.LastName,
  FieldType.FullName,
  FieldType.DocumentNumber,
  FieldType.DateOfBirth,
  FieldType.Address,
  FieldType.PersonalIdNumber,
];

export function uiToDocumentFilter(ui: UiDocumentFilter): DocumentFilter {
  const filter: DocumentFilter = {};
  if (ui.country) {
    filter.country = ui.country;
  }
  if (ui.region) {
    filter.region = ui.region;
  }
  if (ui.documentType) {
    filter.documentType = ui.documentType;
  }
  return filter;
}

export function hasDocumentFilterCriteria(ui: UiDocumentFilter): boolean {
  return !!(ui.country || ui.region || ui.documentType);
}

export function emptyUiDocumentFilter(): UiDocumentFilter {
  return {};
}
