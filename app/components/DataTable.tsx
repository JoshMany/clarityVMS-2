import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  SortDescriptor,
  Input,
} from "@nextui-org/react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import data from "./MOCK_DATA.json";
import Filters from "./Filters";

export default function DataTable() {
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      type: "number",
    },
    {
      header: "First Name",
      accessorKey: "first_name",
      type: "string",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
      type: "string",
    },
    {
      header: "Email",
      accessorKey: "email",
      type: "string",
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [paginationState, setPaginationState] = useState(1);
  const [prevId, setPrevId] = useState<SortDescriptor>({
    column: undefined,
    direction: undefined,
  });

  const TS_Table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const updatedColumns = columns.map((column, id) => ({
    ...column,
    state: "active" as "active" | "desactive",
    id: id,
  }));

  return (
    <div className="w-full ">
      <div className="flex flex-row items-end justify-between my-2">
        <Filters InitialColumns={updatedColumns} />
        <Input
          size="sm"
          label={<p>Global Filter</p>}
          value={filtering}
          variant="flat"
          labelPlacement="outside"
          isClearable
          onValueChange={(e) => {
            setFiltering(e);
            setPaginationState(1);
            TS_Table.setPageIndex(1);
          }}
          onClear={() => setFiltering("")}
          className=" w-64"
        />
      </div>

      <Table
        aria-label="Example static collection table"
        className="max-h-[500px]"
        isHeaderSticky
        fullWidth
        sortDescriptor={{
          column: TS_Table.getState().sorting[0]?.id,
          direction:
            TS_Table.getState().sorting[0]?.desc == false
              ? "descending"
              : "ascending",
        }}
        onSortChange={(id) => {
          if (prevId.column == id.column) {
            id = {
              column: id.column,
              direction:
                id.direction == "ascending" ? "descending" : "ascending",
            };
          }
          if (id.column != prevId.column) {
            setPrevId({ column: id.column, direction: "ascending" });
            id = {
              column: id.column,
              direction: "ascending",
            };
          }

          TS_Table.getColumn(id.column as string)?.toggleSorting(
            id.direction === "ascending" ? false : true
          );
        }}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={paginationState}
              total={TS_Table.getPageCount()}
              onChange={(page) => {
                TS_Table.setPageIndex(page - 1);
                setPaginationState(page);
              }}
            />
          </div>
        }
      >
        <TableHeader>
          {TS_Table.getHeaderGroups()
            .map((headerGroup) => {
              return headerGroup.headers.map((header) => (
                <TableColumn key={header.id} allowsSorting>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableColumn>
              ));
            })
            .flat()}
        </TableHeader>
        <TableBody>
          {TS_Table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-[#27272a]">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.getValue() as string}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
