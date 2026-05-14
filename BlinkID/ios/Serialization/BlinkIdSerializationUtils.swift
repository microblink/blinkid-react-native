//
//  BlinkIdDeserializationUtilities.swift
//  BlinkidReactNative
//
//  Created by Milan Parađina on 22.05.2025..
//

import Foundation
import BlinkID
import UIKit

class BlinkIdSerializationUtils {

    static func serializeBlinkIdScanningResult(_ scanningResult: BlinkIDScanningResult?) -> String? {
        var scanningResultDict = Dictionary<String, Any>()
        
        if let scanningResult {
            
            scanningResultDict["documentClassInfo"] = serializeDocumentClassInfo(scanningResult.documentClassInfo)

            if let dataMatchResult = scanningResult.dataMatchResult {
                scanningResultDict["dataMatchResult"] = serializeDataMatchResult(dataMatchResult)
            }
            if let firstName = scanningResult.firstName {
                scanningResultDict["firstName"] = serializeStringResult(firstName)
            }
            if let lastName = scanningResult.lastName {
                scanningResultDict["lastName"] = serializeStringResult(lastName)
            }
            if let fullName = scanningResult.fullName {
                scanningResultDict["fullName"] = serializeStringResult(fullName)
            }
            if let additionalNameInformation = scanningResult.additionalNameInformation {
                scanningResultDict["additionalNameInformation"] = serializeStringResult(additionalNameInformation)
            }
            if let localizedName = scanningResult.localizedName {
                scanningResultDict["localizedName"] = serializeStringResult(localizedName)
            }
            if let fathersName = scanningResult.fathersName {
                scanningResultDict["fathersName"] = serializeStringResult(fathersName)
            }
            if let mothersName = scanningResult.mothersName {
                scanningResultDict["mothersName"] = serializeStringResult(mothersName)
            }
            if let address = scanningResult.address {
                scanningResultDict["address"] = serializeStringResult(address)
            }
            if let additionalAddressInformation = scanningResult.additionalAddressInformation {
                scanningResultDict["additionalAddressInformation"] = serializeStringResult(additionalAddressInformation)
            }
            if let additionalOptionalAddressInformation = scanningResult.additionalOptionalAddressInformation {
                scanningResultDict["additionalOptionalAddressInformation"] = serializeStringResult(additionalOptionalAddressInformation)
            }
            if let placeOfBirth = scanningResult.placeOfBirth {
                scanningResultDict["placeOfBirth"] = serializeStringResult(placeOfBirth)
            }
            if let nationality = scanningResult.nationality {
                scanningResultDict["nationality"] = serializeStringResult(nationality)
            }
            if let race = scanningResult.race {
                scanningResultDict["race"] = serializeStringResult(race)
            }
            if let religion = scanningResult.religion {
                scanningResultDict["religion"] = serializeStringResult(religion)
            }
            if let profession = scanningResult.profession {
                scanningResultDict["profession"] = serializeStringResult(profession)
            }
            if let maritalStatus = scanningResult.maritalStatus {
                scanningResultDict["maritalStatus"] = serializeStringResult(maritalStatus)
            }
            if let residentialStatus = scanningResult.residentialStatus {
                scanningResultDict["residentialStatus"] = serializeStringResult(residentialStatus)
            }
            if let employer = scanningResult.employer {
                scanningResultDict["employer"] = serializeStringResult(employer)
            }
            if let sex = scanningResult.sex {
                scanningResultDict["sex"] = serializeStringResult(sex)
            }
            if let sponsor = scanningResult.sponsor {
                scanningResultDict["sponsor"] = serializeStringResult(sponsor)
            }
            if let bloodType = scanningResult.bloodType {
                scanningResultDict["bloodType"] = serializeStringResult(bloodType)
            }
            if let documentNumber = scanningResult.documentNumber {
                scanningResultDict["documentNumber"] = serializeStringResult(documentNumber)
            }
            if let cardAccessNumber = scanningResult.cardAccessNumber {
                scanningResultDict["cardAccessNumber"] = serializeStringResult(cardAccessNumber)
            }
            if let personalIdNumber = scanningResult.personalIdNumber {
                scanningResultDict["personalIdNumber"] = serializeStringResult(personalIdNumber)
            }
            if let documentAdditionalNumber = scanningResult.documentAdditionalNumber {
                scanningResultDict["documentAdditionalNumber"] = serializeStringResult(documentAdditionalNumber)
            }
            if let documentOptionalAdditionalNumber = scanningResult.documentOptionalAdditionalNumber {
                scanningResultDict["documentOptionalAdditionalNumber"] = serializeStringResult(documentOptionalAdditionalNumber)
            }
            if let additionalPersonalIdNumber = scanningResult.additionalPersonalIdNumber {
                scanningResultDict["additionalPersonalIdNumber"] = serializeStringResult(additionalPersonalIdNumber)
            }
            if let issuingAuthority = scanningResult.issuingAuthority {
                scanningResultDict["issuingAuthority"] = serializeStringResult(issuingAuthority)
            }
            if let documentSubtype = scanningResult.documentSubtype {
                scanningResultDict["documentSubtype"] = serializeStringResult(documentSubtype)
            }
            if let remarks = scanningResult.remarks {
                scanningResultDict["remarks"] = serializeStringResult(remarks)
            }
            if let residencePermitType = scanningResult.residencePermitType {
                scanningResultDict["residencePermitType"] = serializeStringResult(residencePermitType)
            }
            if let manufacturingYear = scanningResult.manufacturingYear {
                scanningResultDict["manufacturingYear"] = serializeStringResult(manufacturingYear)
            }
            if let vehicleType = scanningResult.vehicleType {
                scanningResultDict["vehicleType"] = serializeStringResult(vehicleType)
            }
            if let eligibilityCategory = scanningResult.eligibilityCategory {
                scanningResultDict["eligibilityCategory"] = serializeStringResult(eligibilityCategory)
            }
            if let specificDocumentValidity = scanningResult.specificDocumentValidity {
                scanningResultDict["specificDocumentValidity"] = serializeStringResult(specificDocumentValidity)
            }
            if let visaType = scanningResult.visaType {
                scanningResultDict["visaType"] = serializeStringResult(visaType)
            }
            if let vehicleOwner = scanningResult.vehicleOwner {
                scanningResultDict["vehicleOwner"] = serializeStringResult(vehicleOwner)
            }
            if let certificateNumber = scanningResult.certificateNumber {
                scanningResultDict["certificateNumber"] = serializeStringResult(certificateNumber)
            }
            if let countryCode = scanningResult.countryCode {
                scanningResultDict["countryCode"] = serializeStringResult(countryCode)
            }
            if let nationalInsuranceNumber = scanningResult.nationalInsuranceNumber {
                scanningResultDict["nationalInsuranceNumber"] = serializeStringResult(nationalInsuranceNumber)
            }
            if let localityCode = scanningResult.localityCode {
                scanningResultDict["localityCode"] = serializeStringResult(localityCode)
            }
            if let maidenName = scanningResult.maidenName {
                scanningResultDict["maidenName"] = serializeStringResult(maidenName)
            }
            if let municipalityCode = scanningResult.municipalityCode {
                scanningResultDict["municipalityCode"] = serializeStringResult(municipalityCode)
            }
            if let municipalityOfRegistration = scanningResult.municipalityOfRegistration {
                scanningResultDict["municipalityOfRegistration"] = serializeStringResult(municipalityOfRegistration)
            }
            if let pollingStationCode = scanningResult.pollingStationCode {
                scanningResultDict["pollingStationCode"] = serializeStringResult(pollingStationCode)
            }
            if let registrationCenterCode = scanningResult.registrationCenterCode {
                scanningResultDict["registrationCenterCode"] = serializeStringResult(registrationCenterCode)
            }
            if let sectionCode = scanningResult.sectionCode {
                scanningResultDict["sectionCode"] = serializeStringResult(sectionCode)
            }
            if let stateCode = scanningResult.stateCode {
                scanningResultDict["stateCode"] = serializeStringResult(stateCode)
            }
            if let stateName = scanningResult.stateName {
                scanningResultDict["stateName"] = serializeStringResult(stateName)
            }
            if let dateOfBirth = scanningResult.dateOfBirth {
                scanningResultDict["dateOfBirth"] = serializeDateResult(dateOfBirth)
            }
            if let dateOfIssue = scanningResult.dateOfIssue {
                scanningResultDict["dateOfIssue"] = serializeDateResult(dateOfIssue)
            }
            if let dateOfExpiry = scanningResult.dateOfExpiry {
                scanningResultDict["dateOfExpiry"] = serializeDateResult(dateOfExpiry)
            }
            if let dateOfEntry = scanningResult.dateOfEntry {
                scanningResultDict["dateOfEntry"] = serializeDateResult(dateOfEntry)
            }
            if let effectiveDate = scanningResult.effectiveDate {
                scanningResultDict["effectiveDate"] = serializeDateResult(effectiveDate)
            }
            if let dateOfExpiryPermanent = scanningResult.dateOfExpiryPermanent {
                scanningResultDict["dateOfExpiryPermanent"] = dateOfExpiryPermanent
            }
            if let driverLicenseDetailedInfo = scanningResult.driverLicenseDetailedInfo {
                scanningResultDict["driverLicenseDetailedInfo"] = serializeDriverLicenseDetailedInfo(driverLicenseDetailedInfo)
            }
            if let dependentsInfo = scanningResult.dependentsInfo {
                scanningResultDict["dependentsInfo"] = dependentsInfo.map(serializeDependentInfo(_:))
            }
            if let parentsInfo = scanningResult.parentsInfo {
                scanningResultDict["parentsInfo"] = parentsInfo.map(serializeParentInfo(_:))
            }
            if let husbandName = scanningResult.husbandName {
                scanningResultDict["husbandName"] = serializeStringResult(husbandName)
            }
            if let legalStatus = scanningResult.legalStatus {
                scanningResultDict["legalStatus"] = serializeStringResult(legalStatus)
            }
            if let socialSecurityStatus = scanningResult.socialSecurityStatus {
                scanningResultDict["socialSecurityStatus"] = serializeStringResult(socialSecurityStatus)
            }
            if let workRestriction = scanningResult.workRestriction {
                scanningResultDict["workRestriction"] = serializeStringResult(workRestriction)
            }
            scanningResultDict["subResults"] = scanningResult.subResults.map(serializeSingleSideScanningResult(_:))

            if let firstInputImage = scanningResult.getInputImage(scanningSide: .first) {
                scanningResultDict["firstInputImage"] = encodeImage(firstInputImage.uiImage)
            }
            if let secondInputImage = scanningResult.getInputImage(scanningSide: .second) {
                scanningResultDict["secondInputImage"] = encodeImage(secondInputImage.uiImage)
            }
            if let barcodeImage = scanningResult.getBarcodeImage() {
                scanningResultDict["barcodeImage"] = encodeImage(barcodeImage.uiImage)
            }
            if let firstDocumentImage = scanningResult.getDocumentImage(scanningSide: .first) {
                scanningResultDict["firstDocumentImage"] = encodeImage(firstDocumentImage.uiImage)
            }
            if let secondDocumentImage = scanningResult.getDocumentImage(scanningSide: .second) {
                scanningResultDict["secondDocumentImage"] = encodeImage(secondDocumentImage.uiImage)
            }
            if let faceImage = scanningResult.getFaceImage() {
                scanningResultDict["faceImage"] = serializeDetailedCroppedImageResult(faceImage)
            }
            if let signatureImage = scanningResult.getSignatureImage() {
                scanningResultDict["signatureImage"] = serializeDetailedCroppedImageResult(signatureImage)
            }
        }
        
        return encodeToJson(scanningResultDict)
    }
    
    static func serializeDocumentClassInfo(_ documentClassInfo: BlinkIDSDK.DocumentClassInfo) -> Dictionary<String, Any?> {
        
        [
            "country": documentClassInfo.country.rawValue,
            "region": documentClassInfo.region.rawValue,
            "documentType": documentClassInfo.documentType.rawValue,
            "countryName": documentClassInfo.countryName,
            "isoNumericCountryCode": documentClassInfo.isoNumericCountryCode,
            "isoAlpha2CountryCode": documentClassInfo.isoAlpha2CountryCode,
            "isoAlpha3CountryCode": documentClassInfo.isoAlpha3CountryCode,
            "isEmpty": documentClassInfo.isEmpty()
        ]
    }
    
    static func serializeDataMatchResult(_ dataMatchResult: DataMatchResult?) -> Dictionary<String, Any?> {
        return [
            "states": dataMatchResult?.states.map(serializeDataMatchState(_:)),
            "overallState": deserializeDataMatchState(dataMatchResult?.overallState)
        ]
    }
    
    static func serializeDataMatchState(_ dataMatchState: FieldState) -> Dictionary<String, Any> {
        return [
            "field": deserializeDataMatchField(dataMatchState.fieldType),
            "state": deserializeDataMatchState(dataMatchState.state)
        ]
    }
    
    static func deserializeDataMatchField(_ field: DataMatchFieldType) -> String {
        switch field {
        case .dateOfBirth:
            return "dateOfBirth"
        case .dateOfExpiry:
            return "dateOfExpiry"
        case .documentNumber:
            return "documentNumber"
        case .documentAdditionalNumber:
            return "documentAdditionalNumber"
        case .documentOptionalAdditionalNumber:
            return "documentOptionalAdditionalNumber"
        case .personalIdNumber:
            return "personalIdNumber"
        @unknown default:
            return ""
        }
    }

    static func serializeStringResult(_ stringResult: BlinkIDSDK.StringResult?) -> Dictionary<String, Any?>{
        var stringResultDict: Dictionary<String, Any?> = [
            "value": stringResult?.value,
            "latin": stringResult?.value(for: .latin),
            "arabic": stringResult?.value(for: .arabic),
            "cyrillic": stringResult?.value(for: .cyrillic),
            "greek": stringResult?.value(for: .greek)
        ]
                
        stringResultDict["location"] = [
            "latin": serializeRect(stringResult?.location(for: .latin)),
            "arabic": serializeRect(stringResult?.location(for: .arabic)),
            "cyrillic": serializeRect(stringResult?.location(for: .cyrillic)),
            "greek": serializeRect(stringResult?.location(for: .greek))
        ]
        
        var sideDict: Dictionary<String, Any?> = [
            "latin": serializeScanningSide(stringResult?.side(for: .latin)),
            "arabic": serializeScanningSide(stringResult?.side(for: .arabic)),
            "cyrillic": serializeScanningSide(stringResult?.side(for: .cyrillic)),
            "greek": serializeScanningSide(stringResult?.side(for: .greek))
        ]
        stringResultDict["side"] = sideDict
        
        return stringResultDict
    }
    
    static func serializeRect(_ rectangle:  BlinkID.RectangleF?) -> Dictionary<String, Any> {
        let rectangleDict: [String: Any?] = [
          "x": rectangle?.origin.x,
          "y": rectangle?.origin.y,
          "width": rectangle?.width,
          "height": rectangle?.height
        ]
        return rectangleDict.compactMapValues { $0 }
    }
    
    static func serializeDateResult<T>(_ dateResult: DateResult<T>?) -> Dictionary<String, Any?>? {
        return [
            "date": serializeSimpleDate(dateResult),
            "filledByDomainKnowledge": dateResult?.filledByDomainKnowledge,
            "successfullyParsed": dateResult?.successfullyParsed,
            "originalString": serializeStringType(dateResult?.originalString)
        ]
    }
    
    static func serializeSimpleDate<T>(_ dateResult: DateResult<T>?) -> Dictionary<String, Any>? {
        let simpleDateDict: [String: Any?] = [
        "day": dateResult?.day,
        "month": dateResult?.month,
        "year": dateResult?.year,
      ]
        return simpleDateDict.compactMapValues { $0 }
    }
    
    static func serializeDriverLicenseDetailedInfo<T>(_ driverLicenseDetailedInfo:  DriverLicenseDetailedInfo<T>?) -> Dictionary<String, Any?>? {
        return [
            "conditions": serializeStringType(driverLicenseDetailedInfo?.conditions),
            "endorsements": serializeStringType(driverLicenseDetailedInfo?.endorsements),
            "restrictions": serializeStringType(driverLicenseDetailedInfo?.restrictions),
            "vehicleClass": serializeStringType(driverLicenseDetailedInfo?.vehicleClass),
            "vehicleClassesInfo": driverLicenseDetailedInfo?.vehicleClassesInfo?.map(serializeVehicleClassInfo(_:)),
        ]
    }
    
    static func serializeVehicleClassInfo<T>(_ vehicleClassInfo: VehicleClassInfo<T>?) -> Dictionary<String, Any?> {
        return [
            "effectiveDate": serializeDateResult(vehicleClassInfo?.effectiveDate),
            "expiryDate":  serializeDateResult(vehicleClassInfo?.expiryDate),
            "licenceType": serializeStringType(vehicleClassInfo?.licenceType),
            "vehicleClass": serializeStringType(vehicleClassInfo?.vehicleClass)
        ]
    }
    static func serializeDependentInfo(_ dependentInfo: DependentInfo?) -> Dictionary<String, Any?> {
        return [
            "dateOfBirth": serializeDateResult(dependentInfo?.dateOfBirth),
            "documentNumber": serializeStringResult(dependentInfo?.documentNumber),
            "fullName": serializeStringResult(dependentInfo?.fullName),
            "sex": serializeStringResult(dependentInfo?.sex)
        ]
    }
    
    static func serializeSingleSideScanningResult(_ singleSideScanningResult: SingleSideScanningResult?) -> Dictionary<String, Any?> {
        guard let singleSideScanningResult else { return [:] }
        
        return [
            "viz": serializeVizResult(singleSideScanningResult.viz),
            "mrz": serializeMrzResult(singleSideScanningResult.mrz),
            "barcode": serializeBarcodeResult(singleSideScanningResult.barcode),
            "inputImage": encodeImage(singleSideScanningResult.inputImage?.uiImage),
            "barcodeImage": encodeImage(singleSideScanningResult.barcodeImage?.uiImage),
            "documentImage": encodeImage(singleSideScanningResult.documentImage?.uiImage),
            "faceImage": serializeDetailedCroppedImageResult(singleSideScanningResult.faceImage),
            "signatureImage": serializeDetailedCroppedImageResult(singleSideScanningResult.signatureImage),
                
            ]
    }
    
    static func serializeBarcodeResult(_ barcodeResult: BarcodeResult?) -> Dictionary<String, Any?> {
        return [
            "barcodeData": serializeBarcodeData(barcodeResult?.barcodeData),
            "parsed": barcodeResult?.parsed,
            "firstName": barcodeResult?.firstName,
            "middleName": barcodeResult?.middleName,
            "lastName": barcodeResult?.lastName,
            "fullName": barcodeResult?.fullName,
            "additionalNameInformation": barcodeResult?.additionalNameInformation,
            "address": barcodeResult?.address,
            "nationality": barcodeResult?.nationality,
            "placeOfBirth": barcodeResult?.placeOfBirth,
            "race": barcodeResult?.race,
            "religion": barcodeResult?.religion,
            "profession": barcodeResult?.profession,
            "maritalStatus": barcodeResult?.maritalStatus,
            "residentialStatus": barcodeResult?.residentialStatus,
            "employer": barcodeResult?.employer,
            "sex": barcodeResult?.sex,
            "dateOfBirth": serializeDateResult(barcodeResult?.dateOfBirth),
            "dateOfIssue": serializeDateResult(barcodeResult?.dateOfIssue),
            "dateOfExpiry": serializeDateResult(barcodeResult?.dateOfExpiry),
            "documentNumber": barcodeResult?.documentNumber,
            "personalIdNumber": barcodeResult?.personalIdNumber,
            "documentAdditionalNumber": barcodeResult?.documentAdditionalNumber,
            "issuingAuthority": barcodeResult?.issuingAuthority,
            "addressDetailedInfo": serializeAddressDetailedInfo(barcodeResult?.addressDetailedInfo),
            "driverLicenseDetailedInfo": serializeDriverLicenseDetailedInfo(barcodeResult?.driverLicenseDetailedInfo),
            "extendedElements": serializeBarcodeExtendedElements(barcodeResult?.extendedElements),
        ]
    }
    
    static func serializeAddressDetailedInfo(_ addressDetailedInfo: AddressDetailedInfo?) -> Dictionary<String, Any?> {
        return [
            "city": addressDetailedInfo?.city,
            "postalCode": addressDetailedInfo?.postalCode,
            "jurisdiction": addressDetailedInfo?.jurisdiction,
            "street": addressDetailedInfo?.street
        ]
    }
    static func serializeBarcodeData(_ barcodeData: BarcodeData?) -> Dictionary<String, Any?> {
        return [
            "barcodeType": serializeBarcodeType(barcodeData?.barcodeType),
            "rawData": barcodeData?.rawData.base64EncodedString(),
            "stringData": barcodeData?.stringData,
            "uncertain": barcodeData?.uncertain
        ]
    }
    
    static func serializeBarcodeType(_ barcodeType: BarcodeType?) -> String {
        switch barcodeType {
        case nil:
            return "none"
        case .qrCode:
            return "qrCode"
        case .dataMatrix:
            return "dataMatrix"
        case .upce:
            return "upce"
        case .upca:
            return "upca"
        case .ean8:
            return "ean8"
        case .ean13:
            return "ean13"
        case .code128:
            return "code128"
        case .code39:
            return "code39"
        case .itf:
            return "itf"
        case .aztec:
            return "aztec"
        case .pdf417:
            return "pdf417"
        case .none?:
            return "none"
        @unknown default:
            return "none"
        }
    }

    static func serializeBarcodeExtendedElements(_ barcodeExtendedElements: BarcodeElements?) -> [String: Any?] {
        var elements = barcodeExtendedElements
        
        return [
            "addressCity": elements?.getValue(for: .addressCity),
            "addressJurisdictionCode": elements?.getValue(for: .addressJurisdictionCode),
            "addressPostalCode": elements?.getValue(for: .addressPostalCode),
            "addressStreet": elements?.getValue(for: .addressStreet),
            "addressStreet2": elements?.getValue(for: .addressStreet2),
            "akaDateOfBirth": elements?.getValue(for: .akaDateOfBirth),
            "akaFamilyName": elements?.getValue(for: .akaFamilyName),
            "akaFullName": elements?.getValue(for: .akaFullName),
            "akaGivenName": elements?.getValue(for: .akaGivenName),
            "akaMiddleName": elements?.getValue(for: .akaMiddleName),
            "akaPrefixName": elements?.getValue(for: .akaPrefixName),
            "akaSocialSecurityNumber": elements?.getValue(for: .akaSocialSecurityNumber),
            "akaSuffixName": elements?.getValue(for: .akaSuffixName),
            "auditInformation": elements?.getValue(for: .auditInformation),
            "cardRevisionDate": elements?.getValue(for: .cardRevisionDate),
            "complianceType": elements?.getValue(for: .complianceType),
            "countryIdentification": elements?.getValue(for: .countryIdentification),
            "customerFamilyName": elements?.getValue(for: .customerFamilyName),
            "customerIdNumber": elements?.getValue(for: .customerIdNumber),
            "customerFirstName": elements?.getValue(for: .customerFirstName),
            "customerFullName": elements?.getValue(for: .customerFullName),
            "customerMiddleName": elements?.getValue(for: .customerMiddleName),
            "dataDiscriminator": elements?.getValue(for: .dataDiscriminator),
            "dateOfBirth": elements?.getValue(for: .dateOfBirth),
            "documentDiscriminator": elements?.getValue(for: .documentDiscriminator),
            "documentExpirationDate": elements?.getValue(for: .documentExpirationDate),
            "documentExpirationMonth": elements?.getValue(for: .documentExpirationMonth),
            "documentIssueDate": elements?.getValue(for: .documentIssueDate),
            "documentNonexpiring": elements?.getValue(for: .documentNonexpiring),
            "documentType": elements?.getValue(for: .documentType),
            "eyeColor": elements?.getValue(for: .eyeColor),
            "familyNameTruncation": elements?.getValue(for: .familyNameTruncation),
            "federalCommercialVehicleCodes": elements?.getValue(for: .federalCommercialVehicleCodes),
            "firstNameTruncation": elements?.getValue(for: .firstNameTruncation),
            "fullAddress": elements?.getValue(for: .fullAddress),
            "hairColor": elements?.getValue(for: .hairColor),
            "height": elements?.getValue(for: .height),
            "heightIn": elements?.getValue(for: .heightIn),
            "heightCm": elements?.getValue(for: .heightCm),
            "issuerIdentificationNumber": elements?.getValue(for: .issuerIdentificationNumber),
            "issuingJurisdiction": elements?.getValue(for: .issuingJurisdiction),
            "issuingJurisdictionName": elements?.getValue(for: .issuingJurisdictionName),
            "jurisdictionEndorsementCodes": elements?.getValue(for: .jurisdictionEndorsementCodes),
            "jurisdictionEndorsmentCodeDescription": elements?.getValue(for: .jurisdictionEndorsmentCodeDescription),
            "jurisdictionRestrictionCodeDescription": elements?.getValue(for: .jurisdictionRestrictionCodeDescription),
            "jurisdictionRestrictionCodes": elements?.getValue(for: .jurisdictionRestrictionCodes),
            "jurisdictionVehicleClass": elements?.getValue(for: .jurisdictionVehicleClass),
            "jurisdictionVehicleClassificationDescription": elements?.getValue(for: .jurisdictionVehicleClassificationDescription),
            "jurisdictionVersionNumber": elements?.getValue(for: .jurisdictionVersionNumber),
            "limitedDurationDocument": elements?.getValue(for: .limitedDurationDocument),
            "medicalIndicator": elements?.getValue(for: .medicalIndicator),
            "middleNameTruncation": elements?.getValue(for: .middleNameTruncation),
            "namePrefix": elements?.getValue(for: .namePrefix),
            "nameSuffix": elements?.getValue(for: .nameSuffix),
            "nonResident": elements?.getValue(for: .nonResident),
            "numberOfDuplicates": elements?.getValue(for: .numberOfDuplicates),
            "organDonor": elements?.getValue(for: .organDonor),
            "permitExpirationDate": elements?.getValue(for: .permitExpirationDate),
            "permitIdentifier": elements?.getValue(for: .permitIdentifier),
            "permitIssueDate": elements?.getValue(for: .permitIssueDate),
            "placeOfBirth": elements?.getValue(for: .placeOfBirth),
            "raceEthnicity": elements?.getValue(for: .raceEthnicity),
            "residenceCity": elements?.getValue(for: .residenceCity),
            "residenceFullAddress": elements?.getValue(for: .residenceFullAddress),
            "residenceJurisdictionCode": elements?.getValue(for: .residenceJurisdictionCode),
            "residencePostalCode": elements?.getValue(for: .residencePostalCode),
            "residenceStreetAddress": elements?.getValue(for: .residenceStreetAddress),
            "residenceStreetAddress2": elements?.getValue(for: .residenceStreetAddress2),
            "securityVersion": elements?.getValue(for: .securityVersion),
            "sex": elements?.getValue(for: .sex),
            "socialSecurityNumber": elements?.getValue(for: .socialSecurityNumber),
            "standardEndorsementCode": elements?.getValue(for: .standardEndorsementCode),
            "standardRestrictionCode": elements?.getValue(for: .standardRestrictionCode),
            "standardVehicleClassification": elements?.getValue(for: .standardVehicleClassification),
            "standardVersionNumber": elements?.getValue(for: .standardVersionNumber),
            "under18": elements?.getValue(for: .under18),
            "under19": elements?.getValue(for: .under19),
            "under21": elements?.getValue(for: .under21),
            "uniqueCustomerId": elements?.getValue(for: .uniqueCustomerId),
            "veteran": elements?.getValue(for: .veteran),
            "weightKilograms": elements?.getValue(for: .weightKilograms),
            "weightPounds": elements?.getValue(for: .weightPounds),
            "weightRange": elements?.getValue(for: .weightRange),
        ]
    }

    
    static func serializeStringType<T>(_ value: T) -> Any? {
        if let stringResult = value as? BlinkID.BlinkIDSDK.StringResult {
            return serializeStringResult(stringResult)
        } else if let str = value as? Swift.String {
            return str
        }
        return nil
    }
    
    static func encodeImage(_ image: UIImage?) -> String? {
        return image?.jpegData(compressionQuality: 1.0)?.base64EncodedString()
    }
    static func serializeMrzResult(_ mrzResult: MRZResult?) -> Dictionary<String, Any?> {
        return [
            "rawMRZString": mrzResult?.rawMRZString,
            "documentCode": mrzResult?.documentCode,
            "issuer": mrzResult?.issuer,
            "documentNumber": mrzResult?.documentNumber,
            "opt1": mrzResult?.opt1,
            "opt2": mrzResult?.opt2,
            "gender": mrzResult?.gender,
            "nationality": mrzResult?.nationality,
            "primaryID": mrzResult?.primaryID,
            "secondaryID": mrzResult?.secondaryID,
            "issuerName": mrzResult?.issuerName,
            "nationalityName": mrzResult?.nationalityName,
            "verified": mrzResult?.verified,
            "dateOfBirth": serializeDateResult(mrzResult?.dateOfBirth),
            "dateOfExpiry": serializeDateResult(mrzResult?.dateOfExpiry),
            "documentType": serializeMrzDocumentType(mrzResult?.documentType),
            "sanitizedOpt1": mrzResult?.sanitizedOpt1,
            "sanitizedOpt2": mrzResult?.sanitizedOpt2,
            "sanitizedNationality": mrzResult?.sanitizedNationality,
            "sanitizedIssuer": mrzResult?.sanitizedIssuer,
            "sanitizedDocumentCode": mrzResult?.sanitizedDocumentCode,
            "sanitizedDocumentNumber": mrzResult?.sanitizedDocumentNumber,
        ]
    }
    
    static func serializeMrzDocumentType(_ documentType: MRZDocumentType?) -> Int? {
        switch documentType {
        case .unknown:
            return 0
        case .identityCard:
            return 1
        case .passport:
            return 2
        case .visa:
            return 3
        case .greenCard:
            return 4
        case .mysPassIMM13P:
            return 5
        case .driverLicense:
            return 6
        case .internalTravelDocument:
            return 7
        case .borderCrossingCard:
            return 8
        case .none:
            return nil
        @unknown default:
            return nil
        }
    }

    static func serializeVizResult(_ vizResult: VIZResult?) -> Dictionary<String, Any> {
        var vizResultDict = Dictionary<String, Any>()
        if let vizResult {
            if let firstName = vizResult.firstName {
                vizResultDict["firstName"] = serializeStringResult(firstName)
            }
            if let lastName = vizResult.lastName {
                vizResultDict["lastName"] = serializeStringResult(lastName)
            }
            if let fullName = vizResult.fullName {
                vizResultDict["fullName"] = serializeStringResult(fullName)
            }
            if let additionalNameInformation = vizResult.additionalNameInformation {
                vizResultDict["additionalNameInformation"] = serializeStringResult(additionalNameInformation)
            }
            if let localizedName = vizResult.localizedName {
                vizResultDict["localizedName"] = serializeStringResult(localizedName)
            }
            if let fathersName = vizResult.fathersName {
                vizResultDict["fathersName"] = serializeStringResult(fathersName)
            }
            if let mothersName = vizResult.mothersName {
                vizResultDict["mothersName"] = serializeStringResult(mothersName)
            }
            if let address = vizResult.address {
                vizResultDict["address"] = serializeStringResult(address)
            }
            if let additionalAddressInformation = vizResult.additionalAddressInformation {
                vizResultDict["additionalAddressInformation"] = serializeStringResult(additionalAddressInformation)
            }
            if let additionalOptionalAddressInformation = vizResult.additionalOptionalAddressInformation {
                vizResultDict["additionalOptionalAddressInformation"] = serializeStringResult(additionalOptionalAddressInformation)
            }
            if let placeOfBirth = vizResult.placeOfBirth {
                vizResultDict["placeOfBirth"] = serializeStringResult(placeOfBirth)
            }
            if let nationality = vizResult.nationality {
                vizResultDict["nationality"] = serializeStringResult(nationality)
            }
            if let race = vizResult.race {
                vizResultDict["race"] = serializeStringResult(race)
            }
            if let religion = vizResult.religion {
                vizResultDict["religion"] = serializeStringResult(religion)
            }
            if let profession = vizResult.profession {
                vizResultDict["profession"] = serializeStringResult(profession)
            }
            if let maritalStatus = vizResult.maritalStatus {
                vizResultDict["maritalStatus"] = serializeStringResult(maritalStatus)
            }
            if let residentialStatus = vizResult.residentialStatus {
                vizResultDict["residentialStatus"] = serializeStringResult(residentialStatus)
            }
            if let sex = vizResult.sex {
                vizResultDict["sex"] = serializeStringResult(sex)
            }
            if let employer = vizResult.employer {
                vizResultDict["employer"] = serializeStringResult(employer)
            }
            if let sponsor = vizResult.sponsor {
                vizResultDict["sponsor"] = serializeStringResult(sponsor)
            }
            if let bloodType = vizResult.bloodType {
                vizResultDict["bloodType"] = serializeStringResult(bloodType)
            }
            if let dateOfBirth = vizResult.dateOfBirth {
                vizResultDict["dateOfBirth"] = serializeDateResult(dateOfBirth)
            }
            if let dateOfIssue = vizResult.dateOfIssue {
                vizResultDict["dateOfIssue"] = serializeDateResult(dateOfIssue)
            }
            if let dateOfExpiry = vizResult.dateOfExpiry {
                vizResultDict["dateOfExpiry"] = serializeDateResult(dateOfExpiry)
            }
            if let dateOfEntry = vizResult.dateOfEntry {
                vizResultDict["dateOfEntry"] = serializeDateResult(dateOfEntry)
            }
            vizResultDict["dateOfExpiryPermanent"] = vizResult.dateOfExpiryPermanent
            if let effectiveDate = vizResult.effectiveDate {
                vizResultDict["effectiveDate"] = serializeDateResult(effectiveDate)
            }
            if let documentNumber = vizResult.documentNumber {
                vizResultDict["documentNumber"] = serializeStringResult(documentNumber)
            }
            if let cardAccessNumber = vizResult.cardAccessNumber {
                vizResultDict["cardAccessNumber"] = serializeStringResult(cardAccessNumber)
            }
            if let personalIdNumber = vizResult.personalIdNumber {
                vizResultDict["personalIdNumber"] = serializeStringResult(personalIdNumber)
            }
            if let documentAdditionalNumber = vizResult.documentAdditionalNumber {
                vizResultDict["documentAdditionalNumber"] = serializeStringResult(documentAdditionalNumber)
            }
            if let documentOptionalAdditionalNumber = vizResult.documentOptionalAdditionalNumber {
                vizResultDict["documentOptionalAdditionalNumber"] = serializeStringResult(documentOptionalAdditionalNumber)
            }
            if let additionalPersonalIdNumber = vizResult.additionalPersonalIdNumber {
                vizResultDict["additionalPersonalIdNumber"] = serializeStringResult(additionalPersonalIdNumber)
            }
            if let issuingAuthority = vizResult.issuingAuthority {
                vizResultDict["issuingAuthority"] = serializeStringResult(issuingAuthority)
            }
            if let visaType = vizResult.visaType {
                vizResultDict["visaType"] = serializeStringResult(visaType)
            }
            if let certificateNumber = vizResult.certificateNumber {
                vizResultDict["certificateNumber"] = serializeStringResult(certificateNumber)
            }
            if let countryCode = vizResult.countryCode {
                vizResultDict["countryCode"] = serializeStringResult(countryCode)
            }
            if let driverLicenseDetailedInfo = vizResult.driverLicenseDetailedInfo {
                vizResultDict["driverLicenseDetailedInfo"] = serializeDriverLicenseDetailedInfo(driverLicenseDetailedInfo)
            }
            if let documentSubtype = vizResult.documentSubtype {
                vizResultDict["documentSubtype"] = serializeStringResult(documentSubtype)
            }
            if let remarks = vizResult.remarks {
                vizResultDict["remarks"] = serializeStringResult(remarks)
            }
            if let residencePermitType = vizResult.residencePermitType {
                vizResultDict["residencePermitType"] = serializeStringResult(residencePermitType)
            }
            if let manufacturingYear = vizResult.manufacturingYear {
                vizResultDict["manufacturingYear"] = serializeStringResult(manufacturingYear)
            }
            if let nationalInsuranceNumber = vizResult.nationalInsuranceNumber {
                vizResultDict["nationalInsuranceNumber"] = serializeStringResult(nationalInsuranceNumber)
            }
            if let vehicleType = vizResult.vehicleType {
                vizResultDict["vehicleType"] = serializeStringResult(vehicleType)
            }
            if let eligibilityCategory = vizResult.eligibilityCategory {
                vizResultDict["eligibilityCategory"] = serializeStringResult(eligibilityCategory)
            }
            if let specificDocumentValidity = vizResult.specificDocumentValidity {
                vizResultDict["specificDocumentValidity"] = serializeStringResult(specificDocumentValidity)
            }
            if let dependentsInfo = vizResult.dependentsInfo {
                vizResultDict["dependentsInfo"] = dependentsInfo.compactMap(serializeDependentInfo(_:))
            }
            if let vehicleOwner = vizResult.vehicleOwner {
                vizResultDict["vehicleOwner"] = serializeStringResult(vehicleOwner)
            }
            if let parentsInfo = vizResult.parentsInfo {
                vizResultDict["parentsInfo"] = parentsInfo.map(serializeParentInfo(_:))
            }
            if let localityCode = vizResult.localityCode {
                vizResultDict["localityCode"] = serializeStringResult(localityCode)
            }
            if let maidenName = vizResult.maidenName {
                vizResultDict["maidenName"] = serializeStringResult(maidenName)
            }
            if let municipalityCode = vizResult.municipalityCode {
                vizResultDict["municipalityCode"] = serializeStringResult(municipalityCode)
            }
            if let municipalityOfRegistration = vizResult.municipalityOfRegistration {
                vizResultDict["municipalityOfRegistration"] = serializeStringResult(municipalityOfRegistration)
            }
            if let pollingStationCode = vizResult.pollingStationCode {
                vizResultDict["pollingStationCode"] = serializeStringResult(pollingStationCode)
            }
            if let registrationCenterCode = vizResult.registrationCenterCode {
                vizResultDict["registrationCenterCode"] = serializeStringResult(registrationCenterCode)
            }
            if let sectionCode = vizResult.sectionCode {
                vizResultDict["sectionCode"] = serializeStringResult(sectionCode)
            }
            if let stateCode = vizResult.stateCode {
                vizResultDict["stateCode"] = serializeStringResult(stateCode)
            }
            if let stateName = vizResult.stateName {
                vizResultDict["stateName"] = serializeStringResult(stateName)
            }
            if let husbandName = vizResult.husbandName {
                vizResultDict["husbandName"] = serializeStringResult(husbandName)
            }
            if let legalStatus = vizResult.legalStatus {
                vizResultDict["legalStatus"] = serializeStringResult(legalStatus)
            }
            if let socialSecurityStatus = vizResult.socialSecurityStatus {
                vizResultDict["socialSecurityStatus"] = serializeStringResult(socialSecurityStatus)
            }
            if let workRestriction = vizResult.workRestriction {
                vizResultDict["workRestriction"] = serializeStringResult(workRestriction)
            }
        }
        return vizResultDict
    }
    
    static func serializeDetailedCroppedImageResult(_ detailedcroppedImageResult: DetailedCroppedImageResult?) -> Dictionary<String, Any?> {
        return [
            "location": serializeRect(detailedcroppedImageResult?.location),
            "side": serializeScanningSide(detailedcroppedImageResult?.side),
            "image": encodeImage(detailedcroppedImageResult?.uiImage)
        ]
    }
    
    static func serializeScanningSide(_ side: ScanningSide?) -> Int? {
        switch side {
        case .first:
            return 0
        case .second:
            return 1
        case .none:
            return nil
        @unknown default:
            return nil
        }
    }
    
    static func deserializeDataMatchState(_ state: DataMatchState?) -> String {
        switch state {
        case .notPerformed: return "notPerfomed"
        case .failed: return "failed"
        case .success: return "success"
        case .none: return "none"
        @unknown default: return "none"
        }
    }
    
    static func serializeParentInfo(_ parentInfo: ParentInfo) -> Dictionary<String, Any> {
        var parentInfoDict: [String: Any] = [:]
        if let firstName = parentInfo.firstName {
            parentInfoDict["firstName"] = serializeStringResult(firstName)
        }
        if let lastName = parentInfo.lastName {
            parentInfoDict["lastName"] = serializeStringResult(lastName)
        }
        return parentInfoDict
    }
    
    static func encodeToJson(_ dict: Dictionary<String, Any>) -> String? {
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: dict, options: .prettyPrinted)
            let resultForJson = String(data: jsonData, encoding: .utf8)
            return resultForJson
        } catch {
            return ""
        }
    }
}
