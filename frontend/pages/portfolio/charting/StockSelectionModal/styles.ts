import styled from "styled-components";
import { cssColors, cssVariables } from "src/styles/css";

export const ContentContainer = styled.div`
  position: relative;
  width: 700px;
  padding: 0 96px;
`;

export const Title = styled.div`
  font-family: ${cssVariables.titleFontFamily};
  font-size: 32px;
  line-height: 32px;
  margin-top: 72px;
  color: ${cssColors.colorBlack};;
`;

export const EditTextContainer = styled.div`
  margin-top: 32px;
`;

export const AddComparisonButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${cssVariables.uiUnitDouble} 0 128px;
  cursor: pointer;
`;

export const AddComparisonButtonText = styled.div`
  font-family: ${cssVariables.titleFontFamily};
  font-weight: ${cssVariables.mediumFontWeight};
  font-size: ${cssVariables.largeFontSize};
  line-height: 25px;
  color: ${cssColors.colorGray4};
  margin-left: ${cssVariables.uiUnitDouble};
`;

export const SaveButtonContainer = styled.div`
  position: absolute;
  right: 96px;
  bottom: 56px;
`;

