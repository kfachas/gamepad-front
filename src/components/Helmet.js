import React from "react";

import { Helmet } from "react-helmet";

export default function HelmetComponent({ title }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content="Helmet application" />
      <link rel="canonical" href="http://localhost:3000" />
    </Helmet>
  );
}
