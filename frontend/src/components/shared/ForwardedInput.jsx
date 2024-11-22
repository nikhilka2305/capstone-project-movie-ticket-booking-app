import React, { forwardRef } from "react";
import Input from "../../components/shared/formcomponents/Input";
const ForwardedInput = forwardRef((props, ref) => {
	return <Input {...props} innerRef={ref} />;
});

export default ForwardedInput;
