import { Properties } from "./renderLayers";

export const formatLayersProperties = (properties?: Properties[]) => {
  if (!properties) {
    return {};
  }

  const propertiesReturn: Record<string, Omit<Properties, "name"> | undefined> =
    {};

  properties.forEach((property) => {
    propertiesReturn[property.name] = {
      type: property.type,
      value: property.value,
    };
  });

  return propertiesReturn;
};
