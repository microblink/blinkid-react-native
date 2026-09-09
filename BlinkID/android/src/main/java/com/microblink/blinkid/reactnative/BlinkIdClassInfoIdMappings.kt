package com.microblink.blinkid.reactnative

import com.microblink.blinkid.core.result.classinfo.CountryId
import com.microblink.blinkid.core.result.classinfo.DocumentTypeId
import com.microblink.blinkid.core.result.classinfo.RegionId

internal object BlinkIdClassInfoIdMappings {
  fun serializeDocumentTypeId(id: DocumentTypeId): String =
    when (id) {
      DocumentTypeId.MyPr -> "myPR"
      DocumentTypeId.MyPolis -> "mypolis"
      DocumentTypeId.MySSSCard -> "mysssCard"
      else -> id.name.replaceFirstChar { it.lowercase() }
    }

  fun serializeCountryId(id: CountryId): String =
    when (id) {
      CountryId.HeardIslandAndMcDonaldIslands -> "heardIslandAndMcdonaldIslands"
      else -> id.name.replaceFirstChar { it.lowercase() }
    }

  fun serializeRegionId(id: RegionId): String =
    id.name.replaceFirstChar { it.lowercase() }

  fun parseDocumentTypeId(value: String): DocumentTypeId? =
    DocumentTypeId.entries.find { serializeDocumentTypeId(it) == value }

  fun parseCountryId(value: String): CountryId? =
    CountryId.entries.find { serializeCountryId(it) == value }

  fun parseRegionId(value: String): RegionId? =
    RegionId.entries.find { serializeRegionId(it) == value }
}
