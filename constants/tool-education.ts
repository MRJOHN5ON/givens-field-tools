import type { TreeHeightMethod } from '@/lib/tree-height/types';

export const cordCalculatorGuide = {
  gettingStarted: {
    title: 'How to Use This Tool',
    steps: [
      'Name or add a log for each felled tree or section you want to measure.',
      'Measure bottom diameter, top diameter (in inches), and log length (in feet).',
      'Optionally select a wood species to estimate BTU output.',
      'Review per-log results and the running total across all logs.',
    ],
  },
  whatIsACord: {
    title: 'What Is a Cord of Wood?',
    paragraphs: [
      'A cord is the standard firewood measurement in the United States and Canada. One full cord is 4 feet high × 4 feet wide × 8 feet long — 128 cubic feet (221,184 cubic inches) of tightly stacked wood.',
      'A full cord typically holds 600–800 pieces of split wood and weighs around 2 tons, though weight varies with species and moisture content.',
      'Face cords are one-third of a full cord — useful when stacks are 16 inches deep instead of the full 4-foot depth.',
    ],
  },
  measuringLog: {
    title: 'Measuring a Felled Log',
    paragraphs: [
      'This tool uses a frustum formula for tapered logs — ideal for whole-tree estimates after felling.',
      'Measure the diameter at the base (butt) and at the top of the usable log section, then the total length in feet.',
    ],
    tips: [
      'Works best when you can measure both bottom and top diameters.',
      'Use 0 for top diameter if the log tapers to a point.',
      'Add separate logs for each tree or section with different measurements.',
      'For branch wood or irregular pieces, measure each section separately.',
    ],
  },
  species: {
    title: 'Wood Species & BTU',
    paragraphs: [
      'Heat output varies significantly by species. Dense hardwoods like oak, hickory, and black locust burn longer and hotter. Softwoods like pine ignite faster but produce less total heat per cord.',
      'BTU estimates here are approximate averages. Actual heat depends on moisture content, split size, and burning conditions.',
    ],
  },
} as const;

export const treeHeightGuide = {
  overview: {
    title: 'Getting Started',
    steps: [
      'Choose your unit system — feet or meters.',
      'Pick a measurement method based on your tools and conditions.',
      'Follow the method instructions below.',
      'Enter your measurements and read the estimated height.',
    ],
  },
  chooseMethod: {
    title: 'Which Method Should I Use?',
    paragraphs: [
      'Standard methods cover most field situations: Angle (distance + angle), Line-of-Sight (Pythagorean), and Shadow (similar triangles on sunny days).',
      'Advanced methods add Clinometer (angle + required eye height) and Triangulation (two positions averaged for higher accuracy). Enter angles from your own clinometer or app — this tool does not include a built-in sensor.',
    ],
  },
  methods: {
    angle: {
      title: 'Angle Method',
      summary:
        'Uses basic trigonometry — horizontal distance and the upward angle to the treetop.',
      steps: [
        'Measure the horizontal distance from where you stand to the tree trunk.',
        'Read the angle of elevation to the treetop with a clinometer app or inclinometer.',
        'Optionally enter your eye height for better accuracy.',
        'Enter the values here to calculate height.',
      ],
      tip: 'Always measure horizontal distance, not distance along a slope. A free clinometer app on your phone works well for the angle reading.',
    },
    'line-of-sight': {
      title: 'Line-of-Sight Method',
      summary:
        'Uses the Pythagorean theorem — horizontal distance and diagonal distance to the treetop.',
      steps: [
        'Measure the horizontal distance to the tree base.',
        'Measure the diagonal (line-of-sight) distance to the treetop.',
        'Enter both values — the calculator finds the vertical height.',
      ],
      tip: 'Line-of-sight distance must be longer than the horizontal base distance.',
    },
    shadow: {
      title: 'Shadow Method',
      summary:
        'Uses similar triangles — the ratio of your height to your shadow equals the tree height to its shadow.',
      steps: [
        'On a sunny day, measure your full standing height.',
        'Measure your shadow length from your feet to the shadow tip.',
        'Measure the tree shadow from the base to the shadow tip.',
        'Enter all three values to calculate tree height.',
      ],
      tip: 'Measure shadows when they are clearly visible — early morning or late afternoon work best. Level ground gives the best accuracy.',
    },
    clinometer: {
      title: 'Clinometer Method',
      summary:
        'Uses a clinometer reading plus distance and eye height — the same formula as Angle, but eye height is required.',
      steps: [
        'Measure the horizontal distance to the tree.',
        'Use a clinometer to sight the top of the tree and record the angle.',
        'Measure your eye height from the ground.',
        'Enter all three values to calculate height.',
      ],
      tip: 'This method matches a dedicated clinometer workflow. Enter the angle from your device — no built-in sensor in this app.',
    },
    triangulation: {
      title: 'Triangulation Method',
      summary:
        'A professional method using two measurement positions — the calculator averages both height estimates.',
      steps: [
        'From the first position, measure distance and angle to the treetop.',
        'Move to a second position with a clear view of the treetop.',
        'Measure distance and angle again from the second position.',
        'Enter all four values — the result is the average of both estimates.',
      ],
      tip: 'Use two positions separated by a meaningful distance for the best accuracy.',
    },
  } satisfies Record<TreeHeightMethod, MethodGuide>,
  tips: {
    title: 'Tips for Accurate Measurements',
    items: [
      'Choose a clear line of sight to the true top of the tree.',
      'Stand on level ground whenever possible.',
      'Take multiple measurements and average them.',
      'Avoid measuring in strong wind — treetops sway.',
      'For sloped terrain, measure horizontal distance, not slope distance.',
      'Identify the actual treetop, not a lower branch.',
    ],
  },
  faq: {
    title: 'Common Questions',
    items: [
      {
        question: 'Why measure tree height?',
        answer:
          'Height helps with forestry planning, timber volume estimates, hazard tree assessment, and wildfire fuel management.',
      },
      {
        question: 'Which method is most accurate?',
        answer:
          'Triangulation averages two positions for higher accuracy. Angle and Clinometer are versatile field methods. Shadow works well on sunny, level ground.',
      },
      {
        question: 'What if the tree is on a slope?',
        answer:
          'Measure horizontal distance to the tree, not distance along the slope. Stand on as level ground as possible when taking angle readings.',
      },
    ],
  },
  disclaimer:
    'This calculator provides estimates only. For critical applications, consult a professional arborist or forester.',
} as const;

type MethodGuide = {
  title: string;
  summary: string;
  steps: readonly string[];
  tip: string;
};

export function getTreeHeightMethodGuide(method: TreeHeightMethod): MethodGuide {
  return treeHeightGuide.methods[method];
}

export const wildfireRiskGuide = {
  overview: {
    title: 'How it works',
    paragraphs: [
      'This tool screens surface wildfire risk at a specific address. It pulls official land-cover and terrain data, blends in live weather and a two-week outlook, then runs a standard fire-behavior model to produce a 0–100 score for planning.',
      'It is educational only — not a substitute for a professional mitigation assessment or official fire-danger ratings.',
    ],
  },
  steps: {
    title: 'Four steps',
    steps: [
      'Locate — geocode your street address to a map coordinate. Rural US addresses use a Census fallback when OpenStreetMap does not have them.',
      'Fuels — official US fuel-layer maps tell us what vegetation could burn, plus slope and canopy cover at that pin.',
      'Weather — current wind, humidity, and temperature feed the model, plus a 16-day outlook and NWS alerts when issued.',
      'Score — a Rothermel surface spread model estimates how fast fire could move, then we convert that into a 0–100 risk score.',
    ],
  },
  ruralTip: {
    title: 'Rural tip',
    paragraphs: [
      'Driveway pins often map as urban even in timber. We scan wildland fuels within ~500 m and score the nearest burnable bed so your result reflects the forest around the home, not just the gravel driveway.',
    ],
  },
  scoreFactors: {
    title: 'How the score is built',
  },
} as const;
