export interface PriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'aditional';
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: 'switch' | 'dropdown' | 'text';
  defaultValue: string;
  availableOptions?: string[];
}

export interface Category {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute;
}
