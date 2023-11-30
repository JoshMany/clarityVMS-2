import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { ChevronDown, Filter, PlusIcon, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type InitialColumnsType = {
  header: string;
  type: string;
  state: "active" | "desactive";
  id: number;
}[];

type ActiveFilterList = {
  column: string;
  type: string;
  condition:
    | "exactly match"
    | "more than"
    | "more than or exactly"
    | "less than"
    | "less than or exactly"
    | "between"
    | "like"
    | "not equal";
  value: string;
}[];

export default function Filters({
  InitialColumns,
}: {
  InitialColumns: InitialColumnsType;
}) {
  const conditionsForNumbers = [
    "exactly match",
    "more than",
    "more than or exactly",
    "less than",
    "less than or exactly",
    "between",
  ];

  const conditionsForString = ["exactly match", "like", "not equal"];

  const [Columns, setColumns] = useState<InitialColumnsType>(InitialColumns);
  const [ActiveFilterList, setActiveFilterList] = useState<ActiveFilterList>(
    []
  );

  const InputsFiltersRef = useRef([]);

  const ColumnFilter = ({ ColumnName }: { ColumnName: string }) => {
    const activeColumns = Columns.filter((column) => column.state === "active");
    return (
      <Dropdown
        showArrow
        classNames={{
          content: "w-min min-w-min",
        }}
      >
        <DropdownTrigger>
          <Chip className="cursor-pointer">
            <div className="flex flex-row items-center gap-2">
              {ColumnName}
              {<ChevronDown size={16} />}
            </div>
          </Chip>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Conditions Menu"
          items={activeColumns}
          onAction={(key) => {
            setColumns((prevColumns) =>
              prevColumns.map((column) =>
                column.header === ColumnName
                  ? { ...column, state: "active" }
                  : column
              )
            );
            setColumns((prevColumns) =>
              prevColumns.map((column) =>
                column.header === key
                  ? { ...column, state: "desactive" }
                  : column
              )
            );
            setActiveFilterList((prevList) =>
              prevList.map((filter) =>
                filter.column === ColumnName
                  ? { ...filter, column: key as string }
                  : filter
              )
            );
            const correspondingColumn = Columns.find(
              (column) => column.header === (key as string)
            );
            if (!correspondingColumn) return;
            setActiveFilterList((prevList) =>
              prevList.map((filter) =>
                filter.column === (key as string)
                  ? { ...filter, type: correspondingColumn.type }
                  : filter
              )
            );

            // Determina el array de condiciones a utilizar
            let conditions: string[];
            if (correspondingColumn.type === "string") {
              conditions = conditionsForString;
            } else if (correspondingColumn.type === "number") {
              conditions = conditionsForNumbers;
            } else {
              return;
            }

            setActiveFilterList((prevList) =>
              prevList.map((filter) =>
                filter.column === (key as string)
                  ? {
                      ...filter,
                      condition: conditions[0] as
                        | "exactly match"
                        | "more than"
                        | "more than or exactly"
                        | "less than"
                        | "less than or exactly"
                        | "between"
                        | "like"
                        | "not equal",
                    }
                  : filter
              )
            );
          }}
        >
          {(column) => (
            <DropdownItem key={column.header}>{column.header}</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const ColumnRelationType = ({
    condition,
    column,
    type,
  }: {
    condition: string;
    column: string;
    type: string;
  }) => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Chip className="cursor-pointer">
            <div className="flex flex-row items-center gap-2">
              {condition}
              {<ChevronDown size={16} />}
            </div>
          </Chip>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Conditions Menu"
          onAction={(key) =>
            setActiveFilterList((prevState) =>
              prevState.map((item) =>
                item.column === column
                  ? {
                      ...item,
                      condition: key as
                        | "exactly match"
                        | "more than"
                        | "more than or exactly"
                        | "less than"
                        | "less than or exactly"
                        | "between",
                    }
                  : item
              )
            )
          }
        >
          {type == "string"
            ? conditionsForString.map((condition) => (
                <DropdownItem key={condition} value={condition}>
                  {condition}
                </DropdownItem>
              ))
            : conditionsForNumbers.map((condition) => (
                <DropdownItem key={condition} value={condition}>
                  {condition}
                </DropdownItem>
              ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const ColumnValue = ({
    value,
    column,
    id,
  }: {
    value: string;
    column: string;
    id: number;
  }) => {
    const updateValue = (e: string) => {
      setActiveFilterList((prevState) =>
        prevState.map((item) =>
          item.column === column ? { ...item, value: e } : item
        )
      );
    };
    useEffect(() => {
      InputsFiltersRef.current = InputsFiltersRef.current.slice(id, id);
    }, []);

    useEffect(() => {
      if (value && id) InputsFiltersRef.current[id];
    }, [value]);

    return (
      <div>
        <Input
          size="sm"
          labelPlacement="outside"
          variant="flat"
          isClearable
          key={id}
          ref={InputsFiltersRef.current[id]}
          value={value}
          radius="full"
          placeholder="Search"
          onValueChange={updateValue}
          onClear={() => {
            setActiveFilterList((prevState) =>
              prevState.map((item) =>
                item.column === column ? { ...item, value: "" } : item
              )
            );
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-row gap-3 items-center">
        <div className="flex flex-col gap-2">
          {ActiveFilterList.map((activeColumn, id) => (
            <div
              key={activeColumn.column}
              className="ml-8 flex flex-row gap-2 items-center"
            >
              <ColumnFilter ColumnName={activeColumn.column} />

              <ColumnRelationType
                column={activeColumn.column}
                condition={activeColumn.condition}
                type={activeColumn.type}
              />

              <ColumnValue
                column={activeColumn.column}
                value={activeColumn.value}
                id={id}
              />

              <Button
                isIconOnly
                radius="lg"
                aria-label="Delete"
                size="sm"
                className="p-0"
                onPress={() => {
                  setActiveFilterList((prevList) =>
                    prevList.filter(
                      (filter) => filter.column !== activeColumn.column
                    )
                  );
                  setColumns((prevColumns) =>
                    prevColumns.map((column) =>
                      column.header === activeColumn.column
                        ? { ...column, state: "active" }
                        : column
                    )
                  );
                }}
              >
                <Trash size={18} />
              </Button>
            </div>
          ))}
          <div className="flex flex-row items-center gap-3">
            <Filter size={20} />
            <Button
              size="sm"
              variant="ghost"
              color="primary"
              startContent={<PlusIcon />}
              className="w-min"
              onPress={() => {
                if (ActiveFilterList.length < InitialColumns.length) {
                  setActiveFilterList((prevState) => {
                    const activeColumn = Columns.find(
                      (column) => column.state === "active"
                    );
                    setColumns((prevColumns) =>
                      prevColumns.map((column) =>
                        column.header === activeColumn?.header
                          ? { ...column, state: "desactive" }
                          : column
                      )
                    );
                    return [
                      ...prevState,
                      {
                        column: activeColumn ? activeColumn.header : "",
                        condition: "exactly match",
                        value: "",
                        type: activeColumn ? activeColumn.type : "",
                      },
                    ];
                  });
                } else {
                  alert("Limite");
                }
              }}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
