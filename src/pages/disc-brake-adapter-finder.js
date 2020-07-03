import React, { useState, useEffect } from "react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const MAX_ADAPTERS = 2

const SIDE_FRONT = "front"
const SIDE_REAR = "rear"
const MOUNT_IS160F = "IS160F"
const MOUNT_IS160R = "IS160R"
const MOUNT_PM140 = "PM140"
const MOUNT_PM160 = "PM160"
const MOUNT_PM170 = "PM170" // output-only
const MOUNT_PM180 = "PM180"
const MOUNT_PM183 = "PM183" // output-only
const MOUNT_PM185 = "PM185" // output-only
const MOUNT_PM200 = "PM200" // output-only
const MOUNT_PM203 = "PM203"
const MOUNT_PM220 = "PM220" // output-only
const MOUNT_FM140F = "FM140F"
const MOUNT_FM140R = "FM140R"
const MOUNT_FM160R = "FM160R"
const MOUNT_FM180R = "FM180R" // output-only
const CALIPER_POST = "post"
const CALIPER_FLAT = "flat"
const ROTOR_140 = 140
const ROTOR_160 = 160
const ROTOR_170 = 170
const ROTOR_180 = 180
const ROTOR_183 = 183
const ROTOR_185 = 185
const ROTOR_200 = 200
const ROTOR_203 = 203
const ROTOR_220 = 220

const mountNames = {
  [MOUNT_IS160F]: "IS Front",
  [MOUNT_IS160R]: "IS Rear",
  [MOUNT_PM140]: "Post Mount 140",
  [MOUNT_PM160]: "Post Mount 160",
  [MOUNT_PM170]: "Post Mount 170",
  [MOUNT_PM180]: "Post Mount 180",
  [MOUNT_PM183]: "Post Mount 183",
  [MOUNT_PM185]: "Post Mount 185",
  [MOUNT_PM200]: "Post Mount 200",
  [MOUNT_PM203]: "Post Mount 203",
  [MOUNT_PM220]: "Post Mount 220",
  [MOUNT_FM140F]: "Flat Mount 140 Front",
  [MOUNT_FM140R]: "Flat Mount 140", // ("Rear")
  [MOUNT_FM160R]: "Flat Mount 160", // ("Rear")
  [MOUNT_FM180R]: "Flat Mount 180", // ("Rear")
}

const allRotors = [
  ROTOR_140,
  ROTOR_160,
  ROTOR_170,
  ROTOR_180,
  ROTOR_183,
  ROTOR_185,
  ROTOR_200,
  ROTOR_203,
  ROTOR_220,
]

function caliperMount(caliper, rotor) {
  if (!caliper || !rotor) {
    return null
  } else if (caliper === CALIPER_POST) {
    switch (rotor) {
      case ROTOR_140:
        return MOUNT_PM140
      case ROTOR_160:
        return MOUNT_PM160
      case ROTOR_170:
        return MOUNT_PM170
      case ROTOR_180:
        return MOUNT_PM180
      case ROTOR_183:
        return MOUNT_PM183
      case ROTOR_185:
        return MOUNT_PM185
      case ROTOR_200:
        return MOUNT_PM200
      case ROTOR_203:
        return MOUNT_PM203
      case ROTOR_220:
        return MOUNT_PM220
      default:
        break
    }
  } else if (caliper === CALIPER_FLAT) {
    switch (rotor) {
      case ROTOR_140:
        return MOUNT_FM140R
      case ROTOR_160:
        return MOUNT_FM160R
      case ROTOR_170:
        return null
      case ROTOR_180:
        return MOUNT_FM180R // for A.S. Solutions IS-FM on Front
      case ROTOR_183:
      case ROTOR_185:
      case ROTOR_200:
      case ROTOR_203:
      case ROTOR_220:
        return null
      default:
        break
    }
  }

  throw new Error(`Unsupported caliper/rotor: ${caliper}/${rotor}`)
}

function deriveSide(mount) {
  switch (mount.slice(-1)) {
    case "F":
      return SIDE_FRONT
    case "R":
      return SIDE_REAR
    default:
      return null
  }
}

const BRAND_AVID_SRAM = "Avid/SRAM"
const BRAND_SRAM = "SRAM"
const BRAND_SHIMANO = "Shimano"
const BRAND_TRP = "TRP"
const BRAND_PROMAX = "Promax"
const BRAND_HOPE = "Hope"
const BRAND_TEKTRO = "Tektro"
const BRAND_MAGURA = "Magura"
const BRAND_HAYES = "Hayes"
const BRAND_PAUL = "Paul"
const BRAND_CAMPAGNOLO = "Campagnolo"
const BRAND_ASSOLUTION = "A.S. Solutions"
const BRAND_NSB = "North Shore Billet"
// const BRAND_KCNC = "KCNC"

const UNOFFICIAL_DEFAULT = "Unofficial adaptation, but likely to work."
const UNOFFICIAL_ISPLUS0 = `${UNOFFICIAL_DEFAULT} Serves as +0mm IS adapter.`
const UNOFFICIAL_ISPLUS20 = `${UNOFFICIAL_DEFAULT} Serves as +20mm IS adapter.`
const UNOFFICIAL_ISPLUS40 = `${UNOFFICIAL_DEFAULT} Serves as +40mm IS adapter.`
const UNOFFICIAL_ISPLUS43 = `${UNOFFICIAL_DEFAULT} Serves as +43mm IS adapter.`
const UNOFFICIAL_ISPLUS60 = `${UNOFFICIAL_DEFAULT} Serves as +60mm IS adapter.`
const UNOFFICIAL_PMPLUS20 = `${UNOFFICIAL_DEFAULT} Serves as +20mm PM adapter.`
const UNOFFICIAL_PMPLUS23 = `${UNOFFICIAL_DEFAULT} Serves as +23mm PM adapter.`
const UNOFFICIAL_PMPLUS40 = `${UNOFFICIAL_DEFAULT} Serves as +40mm PM adapter.`
const UNOFFICIAL_PMPLUS43 = `${UNOFFICIAL_DEFAULT} Serves as +43mm PM adapter.`
const UNOFFICIAL_FMPLUS20 = `${UNOFFICIAL_DEFAULT} Serves as +20mm FM adapter.`
const UNOFFICIAL_FMPMPLUS0 = `${UNOFFICIAL_DEFAULT} Serves as +0mm FM-PM adapter.`
const UNOFFICIAL_FMPMPLUS20 = `${UNOFFICIAL_DEFAULT} Serves as +20mm FM-PM adapter.`

const MESSAGE_ASSOLUTION_WARNING =
  `${BRAND_ASSOLUTION} adapters are not compatible ` +
  `with all frame/fork geometries. ` +
  `Print out one of their templates to check.`

const unofficialSubstituteFor = (officialName, pre = UNOFFICIAL_DEFAULT) =>
  `${pre} If possible, use ${officialName}.`

const allAdapters = [
  // 1.5mm Washers
  {
    brand: "Generic",
    model: "M6 1.5mm Washers",
    mpn: null,
    upc: null,
    configs: [
      [MOUNT_PM180, MOUNT_PM183],
      [MOUNT_PM200, MOUNT_PM203],
    ],
  },

  // Avid/SRAM
  {
    brand: BRAND_AVID_SRAM,
    model: "0mm IS",
    mpn: "00.5318.009.000",
    upc: "710845714429",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "20mm IS",
    mpn: "00.5318.009.001",
    upc: "710845714528",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "30mm IS",
    mpn: "00.5318.009.002",
    upc: "710845714535",
    configs: [[MOUNT_IS160R, MOUNT_PM170]],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "40mm IS",
    mpn: "00.5318.009.003",
    upc: "710845714542",
    configs: [
      [MOUNT_IS160F, MOUNT_PM200],
      [MOUNT_IS160R, MOUNT_PM180],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "60mm IS",
    mpn: "00.5318.009.004",
    upc: "710845714566",
    configs: [
      [MOUNT_IS160R, MOUNT_PM200],
      [MOUNT_IS160F, MOUNT_PM220, UNOFFICIAL_ISPLUS60],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "20mm Post-Mount",
    mpn: "00.5318.007.004",
    upc: "710845768231",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "30mm Post-Mount",
    mpn: "00.5318.007.000",
    upc: "710845714429",
    configs: [[MOUNT_PM140, MOUNT_PM170]],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "40mm Post-Mount",
    mpn: "00.5318.007.003",
    upc: "710845714450",
    configs: [
      [MOUNT_PM140, MOUNT_PM180],
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "20mm Disc Post Spacer Kit with Titanium Standard Bolts",
    mpn: "00.5318.008.004",
    upc: "710845714405",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model:
      "20mm Disc Post Spacer Kit with Titanium CPS Bolts (CPS Calipers Only)",
    mpn: "00.5318.008.005",
    upc: "710845714412",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },
  {
    brand: BRAND_AVID_SRAM,
    model: "10mm Post Mount Disc Brake Adaptor, Fits 170mm Front Rotors",
    mpn: "00.5318.008.000",
    upc: "710845714368",
    configs: [[MOUNT_PM160, MOUNT_PM170]],
  },
  {
    brand: BRAND_AVID_SRAM,
    model:
      "20mm Post Mount Disc Brake Adaptor, Fits 180mm Front and 160mm Rear Rotors",
    mpn: "00.5318.008.003",
    upc: "710845714399",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },

  // SRAM (non-Avid)
  {
    brand: BRAND_SRAM,
    model: "Post Bracket 20P (Stainless Rainbow Bolts)",
    mpn: "00.5318.007.005",
    upc: "710845843518",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },
  {
    brand: BRAND_SRAM,
    model: "Post Bracket 40P (Stainless Rainbow Bolts)",
    mpn: "00.5318.007.006",
    upc: "710845843518",
    configs: [
      [MOUNT_PM140, MOUNT_PM180],
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },
  {
    brand: BRAND_SRAM,
    model: "0/20mm Flat Mount, Fits 140 and 160mm Front Rotors",
    mpn: "00.5318.018.000",
    upc: "710845780622",
    configs: [
      [MOUNT_FM140F, MOUNT_FM140R],
      [MOUNT_FM140F, MOUNT_FM160R],
    ],
  },
  {
    brand: BRAND_SRAM,
    model: "20mm Flat Mount, Fits 160mm Rear Rotors",
    mpn: "00.5318.018.001",
    upc: "710845780646",
    configs: [
      [MOUNT_FM140R, MOUNT_FM160R],
      [MOUNT_FM160R, MOUNT_FM180R, UNOFFICIAL_FMPLUS20],
    ],
  },

  // Shimano
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F203P/P",
    mpn: "ISMMAF203PPA",
    upc: "689228108110",
    configs: [[MOUNT_PM160, MOUNT_PM203]],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F203P/S",
    mpn: "ISMMAF203PSA",
    upc: "689228108127",
    configs: [
      [MOUNT_IS160F, MOUNT_PM203],
      [MOUNT_IS160R, MOUNT_PM183, UNOFFICIAL_ISPLUS43], // (Shimano doesn't have 183mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R140P/D",
    mpn: "ISMMAR140PDH",
    upc: "689228874961",
    configs: [
      [MOUNT_FM140R, MOUNT_PM140],
      [MOUNT_FM160R, MOUNT_PM160, UNOFFICIAL_FMPMPLUS0],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R160P/S",
    mpn: "ISMMAR160PSA",
    upc: "689228108158",
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [
        MOUNT_IS160F,
        MOUNT_PM180,
        unofficialSubstituteFor("SM-MA-F180P/S", UNOFFICIAL_ISPLUS20),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R160P/D",
    mpn: "ISMMAR160PDH",
    upc: "689228874978",
    configs: [
      [MOUNT_FM140R, MOUNT_PM160],
      [MOUNT_FM160R, MOUNT_PM180, UNOFFICIAL_FMPMPLUS20],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R160D/D",
    mpn: "ISMMAR160DDA",
    upc: "689228561601",
    configs: [
      [MOUNT_FM140R, MOUNT_FM160R],
      [MOUNT_FM160R, MOUNT_FM180R, UNOFFICIAL_FMPLUS20],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R203P/S",
    mpn: "ISMMAR203PSA",
    upc: "689228108813",
    configs: [[MOUNT_IS160R, MOUNT_PM203]],
  },
  {
    brand: BRAND_SHIMANO,
    model: "Front 140/160mm Mount Plate, a.k.a. Adapter for BR-RS505 Front",
    mpn: "Y8N230000",
    upc: "689228353657",
    configs: [
      [MOUNT_FM140F, MOUNT_FM140R],
      [MOUNT_FM140F, MOUNT_FM160R],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F140P/D",
    mpn: "ISMMAF140PDA",
    upc: "689228350618",
    configs: [[MOUNT_FM140F, MOUNT_PM140]],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F160P/D",
    mpn: "ISMMAF160PDA",
    upc: "689228350625",
    configs: [[MOUNT_FM140F, MOUNT_PM160]],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F160P/S",
    mpn: "ISMMAF160PSA",
    upc: "689228108103",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [
        MOUNT_IS160R,
        MOUNT_PM140,
        unofficialSubstituteFor("SM-MA90-R140P/S", UNOFFICIAL_ISPLUS0),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F180P/S",
    mpn: "ISMMAF180PSA",
    upc: "689228108141",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [
        MOUNT_IS160R,
        MOUNT_PM160,
        unofficialSubstituteFor("SM-MA-R160P/S", UNOFFICIAL_ISPLUS20),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-R180P/S",
    mpn: "ISMMAR180PSA",
    upc: "689228108165",
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40], // (Shimano doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-R160P/S (XTR-level)",
    mpn: "ISMMA90R160PS",
    upc: "689228430457",
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [
        MOUNT_IS160F,
        MOUNT_PM180,
        unofficialSubstituteFor("SM-MA90-F180P/S", UNOFFICIAL_ISPLUS20),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-F203P/PM (XTR-level)",
    mpn: "ISMMA90F203PPM",
    upc: "689228887435",
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23], // (Shimano doesn't have 183mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-F180P/P (XTR-level)",
    mpn: "ISMMA90F180PPC",
    upc: "689228595576",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20], // (Shimano doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-R180P/S (XTR-level)",
    mpn: "ISMMA90R180PS",
    upc: "689228430440",
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40], // (Shimano doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-F160P/S (XTR-level)",
    mpn: "ISMMA90F160PS",
    upc: "689228430488",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [
        MOUNT_IS160R,
        MOUNT_PM140,
        unofficialSubstituteFor("SM-MA90-R140P/S", UNOFFICIAL_ISPLUS0),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA90-R140P/S (XTR-level)",
    mpn: "ISMMA90R140PS",
    upc: "689228430495",
    configs: [
      [MOUNT_IS160R, MOUNT_PM140],
      [
        MOUNT_IS160F,
        MOUNT_PM160,
        unofficialSubstituteFor("SM-MA90-F160P/S", UNOFFICIAL_ISPLUS0),
      ],
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F180P/P2",
    mpn: "ESMMAF180PP2A",
    upc: "192790506128",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20], // (Shimano doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_SHIMANO,
    model: "SM-MA-F203P/PM",
    mpn: "ESMMAF203PPMA",
    upc: "192790506111",
    configs: [[MOUNT_PM160, MOUNT_PM203]],
  },

  // TRP
  {
    brand: BRAND_TRP,
    model: "Flat Mount Fork to Flat Mount Caliper for 140 or 160 mm Rotor",
    mpn: "ABAD000095",
    upc: "4717592021714",
    configs: [
      [MOUNT_FM140F, MOUNT_FM140R],
      [MOUNT_FM140F, MOUNT_FM160R],
    ],
  },
  {
    brand: BRAND_TRP,
    model: "Flat Mount Frame to Flat Mount Caliper for 160 mm Rotor",
    mpn: "ABAD000099",
    upc: "4717592021875",
    configs: [
      [MOUNT_FM140R, MOUNT_FM160R],
      [MOUNT_FM160R, MOUNT_FM180R, UNOFFICIAL_FMPLUS20],
    ],
  },
  {
    brand: BRAND_TRP,
    model: "A-7 Post Mount Frame/Fork | Post Mount Caliper +43 mm",
    mpn: "ABAD000128",
    upc: "4717592029758",
    configs: [[MOUNT_PM160, MOUNT_PM203]],
  },
  {
    brand: BRAND_TRP,
    model:
      "A-12 Post Mount Frame/Fork | Post Mount Caliper +13 mm (manufacturer typo? should be +23 mm)",
    mpn: "ABAD000093",
    upc: "4717592029239",
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23],
    ],
  },
  {
    brand: BRAND_TRP,
    model: "A-11 Post Mount Frame/Fork - Post Mount Caliper +20 mm",
    mpn: "ABAD000141",
    upc: "4717592018592",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20], // (TRP doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_TRP,
    model:
      "Rear Flat Mount Frame to Post Mount Caliper Adaptor for 160 mm Rotors",
    mpn: "ABAD000075",
    upc: "4717592021882",
    configs: [
      [MOUNT_FM140R, MOUNT_PM160],
      [MOUNT_FM160R, MOUNT_PM180, UNOFFICIAL_FMPMPLUS20],
    ],
  },
  {
    brand: BRAND_TRP,
    model:
      "Rear Flat Mount Frame to Post Mount Caliper Adaptor for 140 mm Rotors",
    mpn: "ABAD000067",
    upc: "4717592021844",
    configs: [
      [MOUNT_FM140R, MOUNT_PM140],
      [MOUNT_FM160R, MOUNT_PM160, UNOFFICIAL_FMPMPLUS0],
    ],
  },
  {
    brand: BRAND_TRP,
    model:
      "Front Flat Mount Fork to Post Mount Caliper Adaptor for 140 mm Rotors",
    mpn: "ABAD000058",
    upc: "4717592021035",
    configs: [[MOUNT_FM140F, MOUNT_PM140]],
  },
  {
    brand: BRAND_TRP,
    model:
      "Front Flat Mount Fork to Post Mount Caliper Adaptor for 160 mm Rotors",
    mpn: "ABHD000686",
    upc: "4717592021059",
    configs: [[MOUNT_FM140F, MOUNT_PM160]],
  },

  // Promax
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter for IS Mount Fork, Fits 160mm Front and 140mm Rear Rotors",
    mpn: "IS160F",
    upc: "657993207130",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter for IS Mount Frame/Fork, Fits 180mm Front and 160mm Rear Rotors",
    mpn: "IS160R/IS180F",
    upc: "657993207154",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapor for IS Mount Frame, Fits 180mm Rear Rotors",
    mpn: "IS180R",
    upc: "657993207178",
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40], // (Promax doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter for Post Mount Frame/Fork, Fits 180mm and 160mm Rotors",
    mpn: "PM180F",
    upc: "657993207192",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20], // (Promax doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Flat Mount Disc Brake Adapter for Flat Mount Fork, Fits 140mm and 160mm Front Rotors",
    mpn: "FH160F/FH140F",
    upc: "657993207215",
    configs: [
      [MOUNT_FM140F, MOUNT_FM140R],
      [MOUNT_FM140F, MOUNT_FM160R],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Flat Mount Disc Brake Adapter for Flat Mount Frame, Fits 160mm Rear Rotors",
    mpn: "FM160R",
    upc: "657993207239",
    configs: [
      [MOUNT_FM140R, MOUNT_FM160R],
      [MOUNT_FM160R, MOUNT_FM180R, UNOFFICIAL_FMPLUS20],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Flat Mount Disc Brake Adapter for Flat Mount Fork, Fits 160mm Front Rotors (increased height and improved cable routing)",
    mpn: "FM160F",
    upc: "657993207253",
    configs: [[MOUNT_FM140F, MOUNT_FM160R]],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter - For Flat Mount Fork, Fits 140mm Front Rotors",
    mpn: "FP140F",
    upc: "657993207277",
    configs: [[MOUNT_FM140F, MOUNT_PM140]],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter - For Flat Mount Fork, Fits 160mm Front Rotors",
    mpn: "FP160F",
    upc: "657993207291",
    configs: [[MOUNT_FM140F, MOUNT_PM160]],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter - For Flat Mount Frame, Fits 140mm Rear Rotors",
    mpn: "FP140R",
    upc: "657993207314",
    configs: [
      [MOUNT_FM140R, MOUNT_PM140],
      [MOUNT_FM160R, MOUNT_PM160, UNOFFICIAL_FMPMPLUS0],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter - For Flat Mount Frame, Fits 160mm Rear Rotors",
    mpn: "FP160R",
    upc: "657993207338",
    configs: [
      [MOUNT_FM140R, MOUNT_PM160],
      [MOUNT_FM160R, MOUNT_PM180, UNOFFICIAL_FMPMPLUS20],
    ],
  },
  {
    brand: BRAND_PROMAX,
    model:
      "Post Mount Disc Brake Adapter for Post Mount Frame/Fork, Fits 203mm Rotors",
    mpn: "PM203F",
    upc: "657993207352",
    configs: [
      [MOUNT_PM160, MOUNT_PM203],
      [MOUNT_PM140, MOUNT_PM183, UNOFFICIAL_PMPLUS43], // (Promax doesn't have 183mm rotors)
    ],
  },

  // Hope
  {
    brand: BRAND_HOPE,
    model: "M-Post Disc Brake Adaptor - 160 To Post 200",
    mpn: "HBMMN",
    upc: "5055168088419",
    configs: [
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM140, MOUNT_PM180, UNOFFICIAL_PMPLUS40],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "P-Post Disc Brake Adaptor - 200 To Post 220",
    mpn: "HBMPN",
    upc: "5056033475440",
    configs: [[MOUNT_PM200, MOUNT_PM220]],
  },
  {
    brand: BRAND_HOPE,
    model: "Q-Post Disc Brake Adaptor - 203 To Post 220",
    mpn: "HBMQN",
    upc: "5056033475464",
    configs: [[MOUNT_PM203, MOUNT_PM220]],
  },
  {
    brand: BRAND_HOPE,
    model: "160mm Post Mount to 180mm Post Mount Disc Brake Adaptor, +20mm",
    mpn: "HBMLN",
    upc: "5055168088389",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "183 Rear/ 203 Front 74mm to IS",
    mpn: "HBMBN",
    upc: "5055168037318",
    configs: [
      [MOUNT_IS160F, MOUNT_PM203],
      [MOUNT_IS160R, MOUNT_PM183],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "203 Post Caliper to Post Fork",
    mpn: "HBMCN",
    upc: "5055168037325",
    configs: [
      [MOUNT_PM160, MOUNT_PM203],
      [MOUNT_PM140, MOUNT_PM183, UNOFFICIAL_PMPLUS43],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "Rear IS to Post 203",
    mpn: "HBMGN",
    upc: "5055168037356",
    configs: [[MOUNT_IS160R, MOUNT_PM203]],
  },
  {
    brand: BRAND_HOPE,
    model: "160mm Rear 74mm to IS",
    mpn: "HBMFN",
    upc: "5055168033716",
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [MOUNT_IS160F, MOUNT_PM180, UNOFFICIAL_ISPLUS20],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "183 Front 74mm to Post Mount",
    mpn: "HBMHN",
    upc: "5055168037363",
    configs: [
      [MOUNT_PM160, MOUNT_PM183],
      [MOUNT_PM180, MOUNT_PM203, UNOFFICIAL_PMPLUS23],
    ],
  },
  {
    brand: BRAND_HOPE,
    model: "183 Front 74mm to IS",
    mpn: "HBMJN",
    upc: "5055168037370",
    configs: [[MOUNT_IS160F, MOUNT_PM183]],
  },
  {
    brand: BRAND_HOPE,
    model: "140 Rear or 160m Front 74mm to IS",
    mpn: "HBMAN",
    upc: "5055168033709",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },

  // Tektro
  {
    brand: BRAND_TEKTRO,
    model: "Front 160mm Post Mount",
    mpn: "ABAD000003",
    upc: "4717592009200",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140, UNOFFICIAL_ISPLUS0],
    ],
  },
  {
    brand: BRAND_TEKTRO,
    model: "Rear 160mm Post Mount",
    mpn: "ABAD000015",
    upc: "4717592009217",
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [MOUNT_IS160F, MOUNT_PM180, UNOFFICIAL_ISPLUS20],
    ],
  },
  {
    brand: BRAND_TEKTRO,
    model: "Rear 180mm",
    mpn: "ABAD000020",
    upc: "4717592010565",
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40], // (Tektro doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_TEKTRO,
    model: "Front 203mm",
    mpn: "ABAD000016",
    upc: "4717592010169",
    configs: [[MOUNT_IS160F, MOUNT_PM203]],
  },

  // Magura
  {
    brand: BRAND_MAGURA,
    model: "QM9 Adaptor for 203mm Rotor on Rear IS Mounts",
    mpn: "0722325",
    upc: "4055184003947",
    configs: [[MOUNT_IS160R, MOUNT_PM203]],
  },
  {
    brand: BRAND_MAGURA,
    model: 'QM26 Adaptor for 203mm Rotor on 7" (180mm) Post Mounts',
    mpn: "0724131",
    upc: "4055184004968",
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23], // (Magura doesn't make 183mm rotors)
    ],
  },
  {
    brand: BRAND_MAGURA,
    model:
      "QM12 Adaptor for 160mm Rotor on Rear IS Mounts or 180mm Rotor on Front IS Mounts",
    mpn: "0722426",
    upc: "4055184004234",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: BRAND_MAGURA,
    model:
      "QM45 Disc Brake Adapter - 180mm-220mm Rotor (Front) or 140mm-180mm Rotor (Rear)",
    mpn: "2701940",
    upc: "4055184025888",
    configs: [
      [MOUNT_PM140, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM220],
      [MOUNT_PM160, MOUNT_PM200, UNOFFICIAL_PMPLUS40], // (Magura doesn't make 200mm rotors)
    ],
  },
  {
    brand: BRAND_MAGURA,
    model: "QM44 Disc Adapter - 180mm-203mm Rotor",
    mpn: "2701967",
    upc: "4055184026878",
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23], // (Magura doesn't make 183mm rotors)
    ],
  },
  {
    brand: BRAND_MAGURA,
    model: "QM40 Adaptor for a 180mm Rotor on 160mm Post Mounts",
    mpn: "2700515",
    upc: "4055184010266",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20], // (Magura doesn't make 200mm rotors)
    ],
  },
  {
    brand: BRAND_MAGURA,
    model: "QM42 Adaptor for a 203mm Rotor on 160mm Post Mounts",
    mpn: "2700517",
    upc: "4055184010280",
    configs: [[MOUNT_PM160, MOUNT_PM203]],
  },
  {
    brand: BRAND_MAGURA,
    model: "QM41 Adaptor for a 180mm Rotor on Rear I.S. Mounts",
    mpn: "2700516",
    upc: "4055184010273",
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40], // (Magura doesn't have 200mm rotors)
    ],
  },
  {
    brand: BRAND_MAGURA,
    model:
      "QM43 Adaptor for a 160mm Rotor on Front I.S. Mounts, also for a 203mm Rotor on [Pre-2014] Fox 40",
    mpn: "2700518",
    upc: "4055184010297",
    configs: [[MOUNT_IS160F, MOUNT_PM160]],
  },

  // Hayes
  {
    brand: BRAND_HAYES,
    model: "Post Disc Brake Adaptor for IS Mount, Front 180mm Rotor Diameter",
    mpn: "98-18640",
    upc: "844171001035",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [
        MOUNT_IS160R,
        MOUNT_PM160,
        unofficialSubstituteFor("Hayes 98-15073", UNOFFICIAL_ISPLUS20),
      ],
    ],
  },
  {
    brand: BRAND_HAYES,
    model:
      "Post Disc Brake Adaptor for Post Mount Frame, +20mm, typically for 180mm Rotor Diameter (four-bolt version)",
    mpn: "98-18639",
    upc: "844171001028",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_HAYES,
    model: "Post Mount Disc Brake Adaptor - 180 mm Mount for 203 mm Rotor",
    mpn: "98-30027",
    upc: "844171057773",
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23], // (Hayes doesn't make 183mm rotors)
    ],
  },
  {
    brand: BRAND_HAYES,
    model:
      "Post Mount Disc Brake Adaptor - 160 mm Mount for 180 mm Rotor (two-bolt version)",
    mpn: "98-32223",
    upc: "844171036266",
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_HAYES,
    model:
      "Post Disc Brake Adaptor for IS Mount, Front 200mm/Rear 180mm Rotor Diameter",
    mpn: "98-18642",
    upc: "844171001059",
    configs: [
      [MOUNT_IS160F, MOUNT_PM200],
      [MOUNT_IS160R, MOUNT_PM180],
    ],
  },
  {
    brand: BRAND_HAYES,
    model:
      "Post Disc Brake Adaptor for IS Mount, Front 160mm/Rear 140mm Rotor Diameter",
    mpn: "98-15068",
    upc: "844171000410",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },
  {
    brand: BRAND_HAYES,
    model: "Post Disc Brake Adaptor for IS Mount, Front 203mm Rotor Diameter",
    mpn: "98-15069",
    upc: "844171000427",
    configs: [
      [MOUNT_IS160F, MOUNT_PM203],
      [MOUNT_IS160R, MOUNT_PM183, UNOFFICIAL_ISPLUS43], // (Hayes doesn't make 183mm rotors)
    ],
  },
  {
    brand: BRAND_HAYES,
    model:
      "Post Disc Brake Adaptor for Post Mount Frame, +43mm, typically for 203mm Rotor Diameter",
    mpn: "98-15072",
    upc: "844171000441",
    configs: [
      [MOUNT_PM160, MOUNT_PM203],
      [MOUNT_PM140, MOUNT_PM183, UNOFFICIAL_PMPLUS43], // (Hayes doesn't make 183mm rotors)
    ],
  },
  {
    brand: BRAND_HAYES,
    model: "Post Disc Brake Adaptor for IS Mount, Rear 160mm Rotor Diameter",
    mpn: "98-15073",
    upc: "844171000458",
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [MOUNT_IS160F, MOUNT_PM180, UNOFFICIAL_ISPLUS20],
    ],
  },
  {
    brand: BRAND_HAYES,
    model: "Post Disc Brake Adaptor for IS Mount, Rear 203mm Rotor Diameter",
    mpn: "98-15074",
    upc: "844171000465",
    configs: [[MOUNT_IS160R, MOUNT_PM203]],
  },

  // Paul
  {
    brand: BRAND_PAUL,
    model: "+0mm IS, Black",
    mpn: "049BLACK01",
    upc: "817496012741",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+20mm IS, Black",
    mpn: "049BLACK02",
    upc: "817496012765",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+40mm IS, Black",
    mpn: "049BLACK03",
    upc: "817496012789",
    configs: [
      [MOUNT_IS160F, MOUNT_PM200],
      [MOUNT_IS160R, MOUNT_PM180],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+20mm Post Mount, Black",
    mpn: "049BLACK04",
    upc: "817496012802",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+40mm Post Mount, Black",
    mpn: "049BLACK05",
    upc: "817496012826",
    configs: [
      [MOUNT_PM140, MOUNT_PM180],
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+0mm IS, Silver",
    mpn: "049SILVER01",
    upc: "817496012741",
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [MOUNT_IS160R, MOUNT_PM140],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+20mm IS, Silver", // not on QBP
    mpn: "049SILVER02",
    upc: "817496012765",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+40mm IS, Silver",
    mpn: "049SILVER03", // not on QBP
    upc: "817496012789",
    configs: [
      [MOUNT_IS160F, MOUNT_PM200],
      [MOUNT_IS160R, MOUNT_PM180],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+20mm Post Mount, Silver",
    mpn: "049SILVER04", // not on QBP
    upc: "817496012802",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_PAUL,
    model: "+40mm Post Mount, Silver",
    mpn: "049SILVER05",
    upc: "817496012826",
    configs: [
      [MOUNT_PM140, MOUNT_PM180],
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },

  // Campagnolo
  {
    brand: BRAND_CAMPAGNOLO,
    model: "H11 Flat Mount Disc Adaptor Kit for 140mm to 160mm Rear Caliper",
    mpn: "AC18-DBADR6",
    upc: "8050046167399",
    configs: [
      [MOUNT_FM140R, MOUNT_FM160R],
      [MOUNT_FM160R, MOUNT_FM180R, UNOFFICIAL_FMPLUS20],
    ],
  },

  // A.S. Solutions
  {
    brand: BRAND_ASSOLUTION,
    model: "140PM-140FM",
    mpn: "ASS0003",
    upc: null,
    configs: [[MOUNT_PM140, MOUNT_FM140R, MESSAGE_ASSOLUTION_WARNING]],
  },
  {
    brand: BRAND_ASSOLUTION,
    model: "140PM-160FM",
    mpn: "ASS0005",
    upc: null,
    configs: [[MOUNT_PM140, MOUNT_FM160R, MESSAGE_ASSOLUTION_WARNING]],
  },
  {
    brand: BRAND_ASSOLUTION,
    model: "160PM-160FM",
    mpn: "ASS0004",
    upc: null,
    configs: [[MOUNT_PM160, MOUNT_FM160R, MESSAGE_ASSOLUTION_WARNING]],
  },
  {
    brand: BRAND_ASSOLUTION,
    model: "IS-FM",
    mpn: "ASS0007",
    upc: null,
    configs: [
      [MOUNT_IS160F, MOUNT_FM180R, MESSAGE_ASSOLUTION_WARNING],
      [MOUNT_IS160R, MOUNT_FM160R, MESSAGE_ASSOLUTION_WARNING],
    ],
  },

  // North Shore Billet (NSB)
  {
    brand: BRAND_NSB,
    model: "203mm (+43mm) Post Mount",
    mpn: "1112867225",
    upc: null,
    configs: [
      [MOUNT_PM160, MOUNT_PM203],
      [MOUNT_PM140, MOUNT_PM183],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "200mm (+40mm) Post Mount",
    mpn: "1112867205",
    upc: null,
    configs: [
      [MOUNT_PM160, MOUNT_PM200],
      [MOUNT_PM140, MOUNT_PM180, UNOFFICIAL_PMPLUS40],
      [MOUNT_PM180, MOUNT_PM220, UNOFFICIAL_PMPLUS40],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "185mm (+25mm) Post Mount",
    mpn: "1112867185",
    upc: null,
    configs: [[MOUNT_PM160, MOUNT_PM185]],
  },
  {
    brand: BRAND_NSB,
    model: "180mm>203mm (+23mm) Post Mount",
    mpn: "16836948097",
    upc: null,
    configs: [
      [MOUNT_PM180, MOUNT_PM203],
      [MOUNT_PM160, MOUNT_PM183, UNOFFICIAL_PMPLUS23],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "180mm (+20mm) Post Mount",
    mpn: "1112867145",
    upc: null,
    configs: [
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM140, MOUNT_PM160, UNOFFICIAL_PMPLUS20],
      [MOUNT_PM180, MOUNT_PM200, UNOFFICIAL_PMPLUS20],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "203mm>220mm (+17mm) Post Mount",
    mpn: "32255817711715",
    upc: null,
    configs: [[MOUNT_PM203, MOUNT_PM220]],
  },
  {
    brand: BRAND_NSB,
    model: "140mm Rear (+0mm) IS Mount", // NOTE identical to 1112864089
    mpn: "1112864081",
    upc: null,
    configs: [
      [MOUNT_IS160R, MOUNT_PM140],
      [
        MOUNT_IS160F,
        MOUNT_PM160,
        unofficialSubstituteFor(
          "North Shore Billet 1112864089",
          UNOFFICIAL_ISPLUS0
        ),
      ],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "160mm Rear (+20mm) IS Mount",
    mpn: "1112864085",
    upc: null,
    configs: [
      [MOUNT_IS160R, MOUNT_PM160],
      [MOUNT_IS160F, MOUNT_PM180, UNOFFICIAL_ISPLUS20],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "160mm Front (+0mm) IS Mount", // NOTE identical to 1112864081
    mpn: "1112864089",
    upc: null,
    configs: [
      [MOUNT_IS160F, MOUNT_PM160],
      [
        MOUNT_IS160R,
        MOUNT_PM140,
        unofficialSubstituteFor(
          "North Shore Billet 1112864081",
          UNOFFICIAL_ISPLUS0
        ),
      ],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "180mm Rear (+40mm) IS Mount",
    mpn: "1112864093",
    upc: null,
    configs: [
      [MOUNT_IS160R, MOUNT_PM180],
      [MOUNT_IS160F, MOUNT_PM200, UNOFFICIAL_ISPLUS40],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "183mm Rear Hope-only (+43mm) IS Mount",
    mpn: "1112864097",
    upc: null,
    configs: [
      [MOUNT_IS160R, MOUNT_PM183],
      [MOUNT_IS160F, MOUNT_PM203, UNOFFICIAL_ISPLUS43],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "185mm Rear (+45mm) IS Mount",
    mpn: "1112864101",
    upc: null,
    configs: [[MOUNT_IS160R, MOUNT_PM185]],
  },
  {
    brand: BRAND_NSB,
    model: "200mm Rear (+60mm) IS Mount",
    mpn: "1112864105",
    upc: null,
    configs: [
      [MOUNT_IS160R, MOUNT_PM200],
      [MOUNT_IS160F, MOUNT_PM220, UNOFFICIAL_ISPLUS60],
    ],
  },
  {
    brand: BRAND_NSB,
    model: "203mm Rear (+63mm) IS Mount",
    mpn: "1112864109",
    upc: null,
    configs: [[MOUNT_IS160R, MOUNT_PM203]],
  },
]

// from => to => set of adapter indices for final lookup
const adapterLookup = allAdapters.reduce(
  (outerAcc, { configs }, i) =>
    configs.reduce((acc, [from, to]) => {
      if (!acc[from]) {
        acc[from] = {}
      }
      if (!acc[from][to]) {
        acc[from][to] = new Set()
      }
      acc[from][to].add(i)
      return acc
    }, outerAcc),
  {}
)

// Form an adjacency list representing edges of the
// directed graph of possible adapter configs
const adjList = allAdapters.reduce(
  (outerAcc, { configs }) =>
    configs.reduce((acc, [from, to]) => {
      if (!acc[from]) {
        acc[from] = new Set()
      }
      acc[from].add(to)
      return acc
    }, outerAcc),
  {}
)

// Determine if path has washers at the end (3mm rotor jump)
function pathHasWashers(path) {
  const l = path.length
  if (l < 2) {
    return false
  }
  const p = path[l - 2]
  const w = path[l - 1]
  return (
    (p === MOUNT_PM180 && w === MOUNT_PM183) ||
    (p === MOUNT_PM200 && w === MOUNT_PM203)
  )
}

// Find all paths from one mount to another using a depth-first search
function allAdapterPaths(from, to) {
  if (!to) {
    return []
  }

  const paths = []
  const visited = new Set()
  const currentPath = []

  function pathsInner(f) {
    visited.add(f)
    currentPath.push(f)

    if (f === to) {
      paths.push([...currentPath]) // (filtered later)
    } else if (adjList[f]) {
      adjList[f].forEach(adj => {
        if (!visited.has(adj)) {
          pathsInner(adj)
        }
      })
    }

    currentPath.pop()
    visited.delete(f)
  }

  pathsInner(from)

  return paths
    .filter(path => {
      const adapterCount = path.length - 1
      if (adapterCount <= 1) {
        return true
      }

      // Has more than one adapter...

      const hasWashers = pathHasWashers(path)

      // Filter out if too many adapters
      // (one over max is ok if it has washers)
      if (
        adapterCount > MAX_ADAPTERS &&
        !(adapterCount === MAX_ADAPTERS + 1 && hasWashers)
      ) {
        return false
      }

      // Don't allow more than one adapter when there's a (!FM -> FM)
      // in the path (likely A.S. Solutions)
      if (
        (!path[0].startsWith("FM") && path[1].startsWith("FM")) ||
        (!path[1].startsWith("FM") && path[2].startsWith("FM"))
      ) {
        return false
      }

      // Don't allow stacking multiple PM-PM adapters
      // In the future, could differentiate between two-bolt and four-bolt
      // PM adapters, only disallowing stacking multiple two-bolt PM-PM adapters,
      // though that's probably too complicated for now.
      let pmStack = 0
      for (let i = 0; i < path.length - (hasWashers ? 1 : 0); i++) {
        pmStack = path[i].startsWith("PM") ? pmStack + 1 : 0
        if (pmStack > 2) {
          return false
        }
      }

      // Don't allow FM140F -> FM140R -> FM160R, since the mount plate
      // (lower) adapter is likely already compatible with FM160R
      if (
        path[0] === MOUNT_FM140F &&
        path[1] === MOUNT_FM140R &&
        path[2] === MOUNT_FM160R
      ) {
        return false
      }

      // Don't allow FM140[F/R] -> FM160R -> FM180R
      if (
        path[0].startsWith("FM140") &&
        path[1] === MOUNT_FM160R &&
        path[2] === MOUNT_FM180R
      ) {
        return false
      }

      return true
    })
    .sort((pathA, pathB) => {
      const aHasWashers = pathHasWashers(pathA)
      const bHasWashers = pathHasWashers(pathB)
      if (!aHasWashers && bHasWashers) {
        // a should come first
        return -1
      } else if (aHasWashers && !bHasWashers) {
        // b should come first
        return 1
      } else {
        // default to length
        return pathA.length - pathB.length
      }
    })
}

function matchAdapterConfigMessage(adapter, from, to) {
  const matchedConfig = adapter.configs.find(([f, t]) => f === from && t === to)
  return (matchedConfig && matchedConfig[2]) || null
}

function pathToAdapters(path) {
  const [from, to, ...restPath] = path
  switch (path.length) {
    case 2:
      return [
        [...adapterLookup[from][to]]
          .map(i => allAdapters[i])
          .map(adapter => ({
            ...adapter,
            matchedConfigMessage: matchAdapterConfigMessage(adapter, from, to),
          })),
      ]
    case 3:
    case 4:
      return pathToAdapters([from, to]).concat(
        pathToAdapters([to, ...restPath])
      )
    default:
      return []
  }
}

function isUnofficialMessage(m) {
  return /unofficial/i.test(m)
}

const AdapterList = ({ adapters }) => {
  return (
    <div>
      {adapters
        // Put unofficial adapters at bottom
        .sort(({ matchedConfigMessage: ma }, { matchedConfigMessage: mb }) => {
          const aIsUnofficial = isUnofficialMessage(ma)
          return aIsUnofficial === isUnofficialMessage(mb)
            ? 0
            : aIsUnofficial
            ? 1
            : -1
        })
        // Render
        .map(({ brand, model, mpn, upc, matchedConfigMessage }) => (
          <div key={`${brand}%%%${model}`} style={{ margin: "1em 0" }}>
            <strong>{brand}</strong> {model}
            {matchedConfigMessage && (
              <>
                <br />
                <small>Note: {matchedConfigMessage}</small>
              </>
            )}
            {mpn && (
              <>
                <br />
                <small>
                  <em>Manufacturer Part Number</em>: {mpn}
                </small>
              </>
            )}
            {upc && (
              <>
                <br />
                <small>
                  <em>UPC</em>: {upc}
                </small>
              </>
            )}
          </div>
        ))}
    </div>
  )
}

const Path = ({ path }) =>
  !path || path.length <= 1 ? null : (
    <pre>
      {path
        .map(p => mountNames[p])
        // Intersperse arrow
        .reduce((acc, p) => [...acc, p, " → "], [])
        .slice(0, -1)}
    </pre>
  )

const Results = ({ mount, caliper, rotor }) => {
  const paths = allAdapterPaths(mount, caliperMount(caliper, rotor))

  const side = deriveSide(mount)

  if (paths.length === 0) {
    return (
      <p>
        <em>No adapters found.</em>
      </p>
    )
  }

  const hasMultiplePaths = paths.length > 1

  return (
    <>
      {paths.map((path, i) => {
        switch (path.length) {
          case 1:
            // No adapter
            return (
              <div key={path[0]}>
                <hr />
                <h3>No Adapter Required</h3>
                <Path path={path} />
                <p>
                  This configuration does not require an adapter. The caliper
                  can be mounted directly on the{" "}
                  {side
                    ? side === SIDE_FRONT
                      ? "fork"
                      : "frame"
                    : "frame or fork"}
                  .
                </p>
              </div>
            )
          case 2:
            // Single adapter (or washers)
            const [adapters] = pathToAdapters(path)
            const isWashers = pathHasWashers(path)
            return (
              <div key={`${path[0]}-${path[1]}`}>
                <hr />
                <h3>
                  {hasMultiplePaths && `${i + 1}. `}
                  {isWashers ? "Washers" : "Solution With Single Adapter"}
                </h3>
                <Path path={path} />
                {adapters.length > 1 && <p>Pick one adapter:</p>}
                {isWashers && "This configuration only requires washers."}
                <AdapterList adapters={adapters} />
              </div>
            )
          case 3:
          case 4:
            // Two adapters, or two adapters + washers
            // Note that upperAdapters could be washers too (with washersMaybe undefined)
            const [lowerAdapters, upperAdapters, washersMaybe] = pathToAdapters(
              path
            )

            const hasWashers = pathHasWashers(path)
            const hasOneAdapterAndWashers = hasWashers && !washersMaybe

            const intermediateName = mountNames[path[1]]

            return (
              <div key={`${path[0]}-${path[1]}-${path[2]}`}>
                <hr />
                <h3>
                  {hasMultiplePaths && `${i + 1}. `}Solution With{" "}
                  {hasOneAdapterAndWashers ? "Single Adapter" : "Two Adapters"}
                  {hasWashers && " and 1.5mm washers"}:{" "}
                  {!hasOneAdapterAndWashers &&
                    `${intermediateName} Intermediate`}
                </h3>
                <Path path={path} />
                {hasOneAdapterAndWashers ? (
                  <p>Pick one adapter (and use M6 1.5mm washers):</p>
                ) : (
                  <>
                    <p>
                      Uses two adapters with {intermediateName} as an
                      intermediate step
                      {hasWashers && ", and 1.5mm washers on top"}. Pick one of
                      the lower adapters and one of the upper adapters for this
                      brake. Not as ideal as a single adapter, but it should
                      work.
                    </p>
                    <h4>Lower Adapters</h4>
                  </>
                )}
                <AdapterList adapters={lowerAdapters} />
                {!hasOneAdapterAndWashers && (
                  <>
                    <h4>Upper Adapters</h4>
                    <AdapterList adapters={upperAdapters} />
                  </>
                )}
                {hasWashers && (
                  <>
                    <h4>Washers</h4>
                    <AdapterList
                      adapters={
                        hasOneAdapterAndWashers ? upperAdapters : washersMaybe
                      }
                    />
                  </>
                )}
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}

const MountOption = ({ mount, ...restProps }) => (
  <option value={mount} {...restProps}>
    {mountNames[mount]}
    {mount.startsWith("FM") && mount.endsWith("R") && " Rear/Standard"}
  </option>
)

const Expander = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="text-button"
        onClick={e => {
          e.preventDefault()
          setOpen(!open)
        }}
      >
        {title}
      </button>
      {open && children}
    </>
  )
}

const DiscBrakeAdapterFinder = () => {
  const [mount, setMount] = useState(null)
  const [caliper, setCaliper] = useState(null)
  const [rotor, setRotor] = useState(null)

  const allowedRotors =
    // IS160F mount + PM caliper: allow >= 160
    mount === MOUNT_IS160F && caliper === CALIPER_POST
      ? allRotors.filter(r => r >= ROTOR_160)
      : // IS160F mount + FM caliper: allow >= 180
      mount === MOUNT_IS160F && caliper === CALIPER_FLAT
      ? allRotors.filter(r => r >= ROTOR_180)
      : // IS160R mount + FM caliper: allow >= 160
      mount === MOUNT_IS160R && caliper === CALIPER_FLAT
      ? allRotors.filter(r => r >= ROTOR_160)
      : // PM160 mount: allow >= 160
      mount === MOUNT_PM160
      ? allRotors.filter(r => r >= ROTOR_160)
      : // PM180 mount: allow >= 180
      mount === MOUNT_PM180
      ? allRotors.filter(r => r >= ROTOR_180)
      : // PM203 mount: allow >= 203
      mount === MOUNT_PM203
      ? allRotors.filter(r => r >= ROTOR_203)
      : // Otherwise, allow all (probably IS160R mount + PM caliper or FM140F/FM140R + PM/FM caliper)
        allRotors

  useEffect(() => {
    if (mount && rotor && !allowedRotors.includes(rotor)) {
      setRotor(null)

      // window.alert(
      //   `The selected frame/fork mount only allows these rotor sizes: ${allowedRotors.join(
      //     ", "
      //   )}. Please select one of those rotor sizes.`
      // )
    }
  }, [mount, rotor, allowedRotors])

  const isCompleted = mount && caliper && rotor && allowedRotors.includes(rotor)

  /* eslint-disable jsx-a11y/no-onchange */
  return (
    <div>
      <form className="form">
        <div className="field">
          <label htmlFor="dbaf-mount">
            <span>Frame/fork mount</span>
            <select
              id="dbaf-mount"
              name="dbaf-mount"
              value={mount || ""}
              onChange={e => setMount(e.target.value || null)}
            >
              <option value="">&mdash;</option>
              <optgroup label="IS">
                <MountOption mount={MOUNT_IS160F} />
                <MountOption mount={MOUNT_IS160R} />
              </optgroup>
              <optgroup label="Flat Mount">
                <MountOption mount={MOUNT_FM140F} />
                <MountOption mount={MOUNT_FM140R} />
                <MountOption mount={MOUNT_FM160R} />
              </optgroup>
              <optgroup label="Post Mount">
                <MountOption mount={MOUNT_PM140} />
                <MountOption mount={MOUNT_PM160} />
                <MountOption mount={MOUNT_PM180} />
                <MountOption mount={MOUNT_PM203} />
              </optgroup>
            </select>
          </label>{" "}
          <Expander title={<small>Which post mount do I have?</small>}>
            <p>
              First, Google your frame/fork specs. If that fails, you can
              measure the distance from the center of the wheel's axle to the
              center of the closest post mount hole face (projected to the YZ
              plane, not direct, i.e. your ruler must not be rotated toward the
              center of the frame), then compare to numbers below. See{" "}
              <a
                href="https://i.imgur.com/3lhPY46.jpg"
                title="Measuring post mount size"
              >
                visual explanation
              </a>
              .
            </p>
            <ul>
              <li>Post Mount 140: ~47.5mm</li>
              <li>Post Mount 160: ~56.3mm</li>
              <li>Post Mount 180: ~65.5mm</li>
              <li>Post Mount 203: ~76.3mm</li>
            </ul>
          </Expander>
        </div>
        <div className="field">
          <label htmlFor="dbaf-caliper">
            <span>Caliper</span>
            <select
              id="dbaf-caliper"
              name="dbaf-caliper"
              value={caliper || ""}
              onChange={e => setCaliper(e.target.value || null)}
            >
              <option value="">&mdash;</option>
              <option value={CALIPER_POST}>Post mount</option>
              <option value={CALIPER_FLAT}>Flat mount</option>
            </select>
          </label>
        </div>
        <div className="field">
          <label htmlFor="dbaf-rotor">
            <span>Rotor</span>
            <select
              id="dbaf-rotor"
              name="dbaf-rotor"
              value={rotor ? `${rotor}` : ""}
              onChange={e =>
                setRotor(e.target.value ? parseInt(e.target.value, 10) : null)
              }
            >
              <option value="">&mdash;</option>
              {allRotors.map(rs => (
                <option
                  value={`${rs}`}
                  key={rs}
                  disabled={!allowedRotors.includes(rs)}
                >
                  {rs}mm
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      {mount && mount.startsWith("IS") && (
        <>
          <p>IS mount exceptions:</p>
          <ul>
            <li>
              Pre-2014 Fox 40, Marzocchi Monster, and Marzocchi 888 Downhill
              Forks (IS203F a.k.a. IS 8"). Use a virtual rotor size of 160mm
              (size actual ~203mm rotor down ~43mm).
            </li>
            <li>
              Pre-2009 Rockshox BoXXer has a proprietary adapter. Use Hayes
              #98-15071 (UPC 844171000434) or DiscoBrakes #OBE-BMS920 (UPC
              5055429913641) with 203mm rotor.
            </li>
            <li>
              Forks with 20mm thru-axles (20x110mm <em>non-boost</em>) and a
              normal IS mount should use Hayes #98-15282 (UPC 844171000472) to
              offset the post mount inboard. See{" "}
              <a
                href="https://www.notubes.com/news/say-what-the-difference-between-20x110mm-thru-axles-and-20x110mm-boost-thru-axles-explained/"
                title="20x110mm explained"
              >
                this article
              </a>
              .
            </li>
            <li>
              PVD StepDown Rear (~IS140R) should size actual rotor up 20mm (e.g.
              160mm actual rotor should use 180mm adapter).
            </li>
            <li>
              Surly Troll/Ogre/ECR/Pugsley w/ adjustable dropouts have a
              proprietary adapter.
            </li>
            <li>All-City Nature Boy has a proprietary adapter.</li>
          </ul>
        </>
      )}
      {mount === MOUNT_FM160R && (
        <>
          <p>
            As of 2020, Flat Mount 160 is only found on a few setups. You can
            use a 160mm rotor with no adapter, or a 180mm rotor with a flat
            mount [rear] 140-to-160 adapter, or a 180mm rotor with an
            integrated-adapter caliper such as the Hope RX4 Rear, or a 180mm+
            rotor with a FM-to-PM adapter(s). Learn more{" "}
            <a
              href="http://www.peterverdone.com/flat-mount-mtb/"
              title="Flat Mount MTB"
            >
              here
            </a>
            . Known setups with Flat Mount 160:
          </p>
          <ul>
            <li>Salsa Cutthroat V2 fork</li>
            <li>
              A few Paragon Machine Works dropouts (DR4041, B4041, DR4048,
              B4048)
            </li>
            <li>A few Whyte frames (rear)</li>
          </ul>
        </>
      )}
      {isCompleted && (
        <>
          <h2>Results</h2>
          <p>
            Just because you can adapt it doesn't mean your frame/fork has
            clearance for your chosen rotor. Clearance depends on chainstay /
            fork blade geometry. Refer to frame/fork specs.
          </p>
          <p>
            Generally, try to use the same brand adapter(s) as your caliper. In
            practice, most brands are compatible. Most adapter and caliper
            brands follow Shimano's standards fairly closely. The major
            exception to this is Avid/SRAM. Final post mount caliper position
            using Avid/SRAM adapters with Shimano and other calipers can be off
            by as much as ~1mm. See{" "}
            <a
              href="http://www.peterverdone.com/disc-brake-mounting-systems/"
              title="Disc Brake Mounting Systems"
            >
              this page
            </a>{" "}
            for details.
          </p>
          {caliper === CALIPER_FLAT && (
            <>
              <p>Flat mount caliper exceptions:</p>
              <ul>
                <li>
                  Shimano BR-UR300 (no plate or adapter, use 160mm rotors)
                </li>
                <li>
                  Hope RX4 Flat Mount (no plate or adapter, use 160mm rotors)
                </li>
              </ul>
            </>
          )}
          {caliper === CALIPER_POST && (
            <p>
              If you have an Avid/SRAM CPS caliper (found on OEM and lower-end
              bikes), you must purchase an Avid/SRAM adapter for its cup washers
              that bring it to the correct position. For all Avid/SRAM adapters
              (CPS <em>or</em> standard), consult{" "}
              <a
                href="https://www.sram.com/globalassets/document-hierarchy/frame-fit-specifications/gen.5232-disc-brake-caliper-specs-road-mtb-rev-g.pdf"
                title="Avid/SRAM Disc Brake Caliper Mounting Specifications"
              >
                Avid/SRAM's disc brake mounting specs
              </a>{" "}
              to determine cup washer order.
            </p>
          )}
          <Results mount={mount} caliper={caliper} rotor={rotor} />
        </>
      )}
    </div>
  )
  /* eslint-enable jsx-a11y/no-onchange */
}

const DiscBrakeAdapterFinderPage = () => (
  <Layout>
    <SEO
      title="Disc Brake Adapter Finder"
      description="Find the correct disc brake adapter for your frame, fork, calipers, and rotors"
    />
    <PageTitle>Disc Brake Adapter Finder</PageTitle>
    <Content>
      <p>
        I think almost every bike mechanic has accidentally ordered the wrong
        disc brake adapter at one time or another. I decided to make a simple
        online wizard to make it easy. Simply enter your frame/fork mount
        standard, caliper standard, and rotor size. It should return a list of
        possible adapters, or adapter combinations if necessary.
      </p>
      <DiscBrakeAdapterFinder />
    </Content>
  </Layout>
)

export default DiscBrakeAdapterFinderPage
