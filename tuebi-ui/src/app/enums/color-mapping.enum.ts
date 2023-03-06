// Color Mapping: Make bookmark tags colorful
export interface ColorMappingI {
  [p: string]: {bc: string, tc: string, label: string}
}

export const COLOR_MAPPING: ColorMappingI = {
  '#FFCDD2': {
    bc: '#FFCDD2',
    tc: '#FF152C',
    label: 'Pink',
  },
  '#E1BEE7': {
    bc: '#E1BEE7',
    tc: '#A744B8',
    label: 'Purple',
  },
  '#BBDEFB': {
    bc: '#BBDEFB',
    tc: '#168EF1',
    label: 'Blue',
  },
  '#B2EBF2': {
    bc: '#B2EBF2',
    tc: '#24C4D8',
    label: 'Teal',
  },
  '#A5D6A7': {
    bc: '#A5D6A7',
    tc: '#479C4B',
    label: 'Green',
  },
  '#E6EE9C': {
    bc: '#E6EE9C',
    tc: '#B9CA23',
    label: 'Lime',
  },
  '#FFECB3': {
    bc: '#FFECB3',
    tc: '#FFC105',
    label: 'Amber',
  },
  '#D7CCC8': {
    bc: '#D7CCC8',
    tc: '#907369',
    label: 'Brown',
  },
  '#F5F5F5': {
    bc: '#F5F5F5',
    tc: '#939393',
    label: 'Gray',
  },
  '#CFD8DC': {
    bc: '#CFD8DC',
    tc: '#6C8894',
    label: 'Blue Gray',
  }
  
}