import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import {
  FileBarChart,
  FileStack,
  GripVertical,
  MoreVertical,
  PencilRuler,
  Trash2,
} from "lucide-react";
import { Key } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { DuplicateChart, DeleteChart } from "../lib/actions";
import { useDashboardState } from "@/store/analytics";

export const WidgetTopbar = ({
  chartName,
  chartUUID,
}: {
  chartName: string;
  chartUUID: string;
}) => {
  const { activeDashboard } = useDashboardState();
  const OptionsHandler = async (key: Key) => {
    switch (key) {
      case "duplicate":
        toast.promise(
          DuplicateChart({
            chartUUID: chartUUID,
          }),
          {
            loading: "Duplicating...",
            success: (response: string) => {
              mutate(`/api/charts?dashboard=${activeDashboard}`);
              return response;
            },
            error: (response: string) => {
              mutate(`/api/charts?dashboard=${activeDashboard}`);
              return response;
            },
          }
        );
        break;
      case "delete":
        toast.promise(
          DeleteChart({
            chartUUID: chartUUID,
          }),
          {
            loading: "Deleting...",
            success: (data: { message: string; status: boolean }) => {
              mutate(`/api/charts?dashboard=${activeDashboard}`);
              return data.message;
            },
            error: (data: { message: string; status: boolean }) => {
              mutate(`/api/charts?dashboard=${activeDashboard}`);
              return data.message;
            },
          }
        );

        break;
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-between select-none p-1">
      <span className="flex items-center gap-2 ">
        <div className="drag-handle">
          <GripVertical />
        </div>

        {chartName}
      </span>

      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              color="primary"
              aria-label="Menu"
              radius="full"
            >
              <MoreVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            onAction={(key) => OptionsHandler(key)}
          >
            <DropdownSection title="Actions">
              <DropdownItem
                key="duplicate"
                startContent={<FileStack />}
                description="Create another widget exactly like this one."
              >
                Duplicate
              </DropdownItem>
              <DropdownItem
                key="edit"
                startContent={<PencilRuler />}
                description="Open the Edit form."
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="export"
                startContent={<FileBarChart />}
                description="Export the visalized data into the widget."
              >
                Export
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                startContent={<Trash2 />}
                className="text-danger"
                color="danger"
                description="Delete this widget."
              >
                Delete
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
