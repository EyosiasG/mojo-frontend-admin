import React, { Suspense } from "react";
import StepTwo from "@/components/StepTwo";
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StepTwo />
    </Suspense>
  );
};

export default Page;
