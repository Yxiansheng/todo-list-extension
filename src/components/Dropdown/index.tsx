import RCDropdown from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import { DropdownProps } from "rc-dropdown/lib/Dropdown";

interface IDropdownProps extends DropdownProps {}

export const Dropdown: React.FunctionComponent<IDropdownProps> = (props) => {
  const { children, ...restProps } = props;

  return <RCDropdown {...restProps}>{children}</RCDropdown>;
};
