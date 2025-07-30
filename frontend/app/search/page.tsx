"use client";

import queryString from "query-string";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import Calendar from "@/app/components/inputs/Calendar";
import Counter from "@/app/components/inputs/Counter";
import LocationInput, { LocationValue } from "@/app/components/inputs/CountrySelect";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<LocationValue>();
  const [itemCount, setitemCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      itemCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    router.push(url);
  }, [
    step,
    location,
    router,
    itemCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you want to find items?"
        subtitle="Find the perfect location!"
      />
      <LocationInput
        value={location}
        onChange={(value: LocationValue) => setLocation(value)}
      />
      <hr />
      <Map center={undefined} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you need the item?"
          subtitle="Make sure to pick your dates!"
        />
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect item!"
        />
        <Counter
          onChange={(value) => setitemCount(value)}
          value={itemCount}
          title="Item Count"
          subtitle="How many items do you need?"
        />
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Items
            </h1>
            <p className="text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="space-y-6">
            {bodyContent}
            
            <div className="flex flex-row gap-4 pt-6">
              {secondaryActionLabel && (
                <Button
                  outline
                  label={secondaryActionLabel}
                  onClick={onBack}
                />
              )}
              <Button
                label={actionLabel}
                onClick={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchPage;
