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

export interface Product {
  name: string;
  description: string;
  tenantId: string;
  categoryId: string;
  image?: string; // Optional, if you are using file uploads
  isPublish: boolean;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute;
}
