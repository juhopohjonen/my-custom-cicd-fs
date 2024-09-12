import React, { useState } from "react";

const SuccessMessage = ({message}) => message ? <p>{message}</p> : null
const FailedMessage = ({message}) => message ? <p id="failedMessage">{message}</p> : null

export { SuccessMessage, FailedMessage }