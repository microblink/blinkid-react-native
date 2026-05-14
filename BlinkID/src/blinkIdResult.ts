import type {
  StringResult,
  DataMatchResult,
  DocumentClassInfo,
  DependentInfo,
  SingleSideScanningResult,
  DriverLicenseDetailedInfo,
  DateResult,
  DetailedCroppedImageResult,
  ParentInfo,
} from "./types";

/**
 * Represents the results of scanning a document.
 *
 * This class contains the results of scanning a document, including the extracted data
 * and images from the document.
 *
 **/
export type BlinkIdScanningResult = {
  /**
   * The document class information.
   *
   * See {@link DocumentClassInfo} for more information.
   */
  documentClassInfo?: DocumentClassInfo;

  /**
   * Info on whether the data extracted from multiple sides matches.
   *
   * See {@link DataMatchResult} for more information.
   */
  dataMatchResult?: DataMatchResult;

  /**
   * The first name of the document owner.
   *
   */
  firstName?: StringResult;

  /**
   * The last name of the document owner.
   *
   */
  lastName?: StringResult;

  /**
   * The full name of the document owner.
   *
   */
  fullName?: StringResult;

  /**
   * The additional name information of the document owner.
   *
   */
  additionalNameInformation?: StringResult;

  /**
   * The localized name of the document owner.
   *
   */
  localizedName?: StringResult;
  /**
   * The fathers name of the document owner.
   *
   */
  fathersName?: StringResult;

  /**
   * The mothers name of the document owner.
   *
   */
  mothersName?: StringResult;

  /**
   * The address of the doicument owner.
   *
   */
  address?: StringResult;

  /**
   * The additional address information of the document owner.
   *
   */
  additionalAddressInformation?: StringResult;

  /**
   * The one more additional address information of the document owner.
   *
   */
  additionalOptionalAddressInformation?: StringResult;

  /**
   * The place of birth of the document owner.
   *
   */
  placeOfBirth?: StringResult;

  /**
   * The nationality of the document owner.
   *
   */
  nationality?: StringResult;

  /**
   * The race of the document owner.
   *
   */
  race?: StringResult;

  /**
   * The religion of the document owner.
   *
   */
  religion?: StringResult;

  /**
   * The profession of the document owner.
   *
   */
  profession?: StringResult;

  /**
   * The marital status of the document owner.
   *
   */
  maritalStatus?: StringResult;

  /**
   * The residential status of the document owner.
   *
   */
  residentialStatus?: StringResult;

  /**
   * The employer of the document owner.
   *
   */
  employer?: StringResult;

  /**
   * The sex of the document owner.
   *
   */
  sex?: StringResult;

  /**
   * The sponsor of the document owner.
   *
   */
  sponsor?: StringResult;

  /**
   * The blood type of the document owner.
   *
   */
  bloodType?: StringResult;

  /**
   * The document number.
   *
   */
  documentNumber?: StringResult;

  /**
   *
   * The card access number.
   */
  cardAccessNumber?: StringResult;

  /**
   * The personal identification number.
   *
   */
  personalIdNumber?: StringResult;

  /**
   * The additional number of the document.
   *
   */
  documentAdditionalNumber?: StringResult;

  /**
   * The one more additional number of the document.
   *
   */
  documentOptionalAdditionalNumber?: StringResult;

  /**
   * The additional personal identification number.
   *
   */
  additionalPersonalIdNumber?: StringResult;

  /**
   * The issuing authority of the document.
   *
   */
  issuingAuthority?: StringResult;

  /**
   * The transcription of the document subtype.
   *
   */
  documentSubtype?: StringResult;

  /**
   * The remarks on the residence permit.
   *
   */
  remarks?: StringResult;

  /**
   * The residence permit type.
   *
   */
  residencePermitType?: StringResult;

  /**
   * The manufacturing year.
   *
   */
  manufacturingYear?: StringResult;

  /**
   * The vehicle owner.
   *
   */
  vehicleOwner?: StringResult;

  /**
   * The vehicle type.
   *
   */
  vehicleType?: StringResult;

  /**
   * The eligibility category.
   *
   */
  eligibilityCategory?: StringResult;

  /**
   * The specific document validity.
   *
   */
  specificDocumentValidity?: StringResult;

  /**
   * The visa type of the document.
   *
   */
  visaType?: StringResult;

  /**
   * The country code of the document owner.
   *
   */
  countryCode?: StringResult;

  /**
   * The certificate number of the document owner.
   *
   */
  certificateNumber?: StringResult;

  /**
   * The national insurance number of the document owner.
   *
   */
  nationalInsuranceNumber?: StringResult;

  /**
   * The date of birth of the document owner.
   *
   */
  dateOfBirth?: DateResult<StringResult>;

  /**
   * The date of issue of the document.
   *
   */
  dateOfIssue?: DateResult<StringResult>;

  /**
   * The date of expiry of the document.
   *
   */
  dateOfExpiry?: DateResult<StringResult>;

  /**
   * Determines if date of expiry is permanent.
   *
   */
  dateOfExpiryPermanent?: boolean;
  /**
   * The date of entry of the document owner.
   *
   */
  dateOfEntry?: DateResult<StringResult>;

  /**
   * The locality code of the document owner.
   *
   */
  localityCode?: StringResult;

  /**
   * The maiden name of the document owner.
   *
   */
  maidenName?: StringResult;

  /**
   * The municipality code of the document owner.
   *
   */
  municipalityCode?: StringResult;

  /**
   * The municipality of registration of the document owner.
   *
   */
  municipalityOfRegistration?: StringResult;

  /**
   * The polling station code of the document owner.
   *
   */
  pollingStationCode?: StringResult;

  /**
   * The registration center code of the document owner.
   *
   */
  registrationCenterCode?: StringResult;

  /**
   * The section code of the document owner.
   *
   */
  sectionCode?: StringResult;

  /**
   * The state code of the document owner.
   *
   */
  stateCode?: StringResult;

  /**
   * The state of the document owner.
   *
   */
  stateName?: StringResult;

  /**
   * The driver license detailed info.
   *
   * See {@link DriverLicenseDetailedInfo} for more information.
   */
  driverLicenseDetailedInfo?: DriverLicenseDetailedInfo<StringResult>;
  /**
   * The dependents info.
   *
   * See {@link DependentInfo} for more information.
   */
  dependentsInfo?: DependentInfo[];

  /**
   * The results of scanning each side of the document.
   *
   * See {@link SingleSideScanningResult} for more information.
   */
  subResults?: SingleSideScanningResult[];
  /**
   * Returns the input image for the first scanning side in the Base64 format.
   *
   * Or `null` if the input image is not available.
   */
  firstInputImage?: string;
  /**
   * Returns the input image for the second scanning side in the Base64 format.
   *
   * Or `null` if the input image is not available.
   */
  secondInputImage?: string;

  /**
   * Returns the input image containing parsable barcode.
   *
   * Or `null` if the barcode input image is not available.
   */
  barcodeInputImage?: string;
  /**
   * Returns the cropped document image for the first scanning side.
   *
   * Or `null` if the document image is not available.
   */
  firstDocumentImage?: string;

  /**
   * Returns the cropped document image for the second scanning side.
   *
   * Or `null` if the document image is not available.
   */
  secondDocumentImage?: string;
  /**
   * Returns the cropped face image with additional info.
   * Or `null` if the face image is not available.
   *
   * See {@link DetailedCroppedImageResult} for more information.
   */
  faceImage?: DetailedCroppedImageResult;

  /**
   * Returns the cropped signature image with additional info.
   * Or `null` if the signature image is not available.
   *
   * See {@link DetailedCroppedImageResult} for more information.
   */
  signatureImage?: DetailedCroppedImageResult;

  /**
   * The effective date of the document.
   */
  effectiveDate?: DateResult<StringResult>;

  /**
   * The parents info.
   *
   * See {@link ParentInfo} for more information.
   */
  parentsInfo?: ParentInfo[];

  /**
   * The husband name of the document owner.
   */
  husbandName?: StringResult;

  /**
   * The legal status of the document owner.
   */
  legalStatus?: StringResult;

  /**
   * The social security status of the document owner.
   */
  socialSecurityStatus?: StringResult;

  /**
   * The work restriction of the document owner.
   */
  workRestriction?: StringResult;
};
