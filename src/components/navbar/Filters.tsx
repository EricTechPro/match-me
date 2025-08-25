import React from "react";
import {
  Button,
  Select,
  SelectItem,
  Slider,
  Spinner,
  Switch,
} from "@nextui-org/react";
import { useFilters } from "@/hooks/useFilters";

export default function Filters() {
  const {
    orderByList,
    genderList,
    selectAge,
    selectGender,
    selectOrder,
    selectWithPhoto,
    filters,
    totalCount,
    isPending,
  } = useFilters();

  const { gender, ageRange, orderBy } = filters;

  return (
    <div className="shadow-md py-4 px-4 lg:px-6">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row justify-around items-center">
        <div className="flex gap-2 items-center">
          <div className="text-default font-semibold text-xl">
            Results:{" "}
            {isPending ? (
              <Spinner
                size="sm"
                color="default"
              />
            ) : (
              totalCount
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div>Gender:</div>
          {genderList.map(
            ({ icon: Icon, value }) => (
              <Button
                key={value}
                size="sm"
                isIconOnly
                color="default"
                variant={
                  gender.includes(value)
                    ? "solid"
                    : "light"
                }
                onClick={() =>
                  selectGender(value)
                }
              >
                <Icon size={24} />
              </Button>
            )
          )}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/4">
          <Slider
            label="Age range"
            size="sm"
            minValue={18}
            maxValue={100}
            defaultValue={ageRange}
            aria-label="Age range slider"
            color="foreground"
            onChangeEnd={(value) =>
              selectAge(value as number[])
            }
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm">With photo</p>
          <Switch
            color="default"
            defaultSelected
            size="sm"
            onChange={(checked) =>
              selectWithPhoto(checked)
            }
          />
        </div>
        <div className="w-1/4">
          <Select
            size="sm"
            fullWidth
            label="Order by"
            variant="bordered"
            color="default"
            aria-label="Order by selector"
            selectedKeys={new Set([orderBy])}
            onSelectionChange={selectOrder}
          >
            {orderByList.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {/* Results Row */}
        <div className="flex justify-between items-center">
          <div className="text-default font-semibold text-lg">
            Results:{" "}
            {isPending ? (
              <Spinner
                size="sm"
                color="default"
              />
            ) : (
              totalCount
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">With photo</p>
            <Switch
              color="default"
              defaultSelected
              size="sm"
              onChange={(checked) =>
                selectWithPhoto(checked)
              }
            />
          </div>
        </div>

        {/* Gender and Order Row */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2 items-center">
            <div className="text-sm font-medium">Gender:</div>
            {genderList.map(
              ({ icon: Icon, value }) => (
                <Button
                  key={value}
                  size="sm"
                  isIconOnly
                  color="default"
                  variant={
                    gender.includes(value)
                      ? "solid"
                      : "light"
                  }
                  onClick={() =>
                    selectGender(value)
                  }
                >
                  <Icon size={20} />
                </Button>
              )
            )}
          </div>
          <div className="flex-1 max-w-32">
            <Select
              size="sm"
              fullWidth
              label="Order by"
              variant="bordered"
              color="default"
              aria-label="Order by selector"
              selectedKeys={new Set([orderBy])}
              onSelectionChange={selectOrder}
            >
              {orderByList.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Age Range Row */}
        <div className="px-2">
          <Slider
            label="Age range"
            size="sm"
            minValue={18}
            maxValue={100}
            defaultValue={ageRange}
            aria-label="Age range slider"
            color="foreground"
            onChangeEnd={(value) =>
              selectAge(value as number[])
            }
          />
        </div>
      </div>
    </div>
  );
}
