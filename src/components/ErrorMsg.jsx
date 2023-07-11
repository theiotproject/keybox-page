function ErrorMsg({ errorCode, errorMessage }) {
  return (
    <div>
      <span>Error</span>
      <code>{`${errorCode} - ${errorMessage}`}</code>
    </div>
  );
}

export default ErrorMsg;
