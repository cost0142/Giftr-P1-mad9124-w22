function formatServerError(err) {
  return [
    {
      status: "500",
      title: "Server error",
      description:
        err?.message || "Oops, something went wrong. Please check the logs.",
    },
  ];
}

function formatValidationError(errors) {
  return Object.values(errors).map((error) => {
    return {
      status: "400",
      title: "Validation Error",
      detail: error.message,
      source: { pointer: `/data/attribute/${error.path}`, value: error.value },
    };
  });
}

export default function handleError(err, req, res, next) {
  const isValidationError = err?.name === "ValidationError";
  const code = isValidationError ? 400 : err.code || 500;

  let payload = [err];
  if (code === 400) payload = formatValidationError(err.errors);
  if (code === 500) payload = formatValidationError(err);

  res.status(code).json({
    errors: payload,
  });
}
