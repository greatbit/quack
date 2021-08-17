const FieldError = ({ children }) =>
  children ? (
    <div className="bg-error text-white text-sm rounded-b-md p-1 pl-2 pr-2 ml-4 mr-4 relative top-0 z-0">
      {children}
    </div>
  ) : null;

export default FieldError;
