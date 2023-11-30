import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Axis3D, Calendar, Plus } from "lucide-react";
import { Dispatch, Key, SetStateAction } from "react";

export default function AddChartDropdown({
  AddWidgetModalHandler,
  setWidgetChart,
}: {
  AddWidgetModalHandler: () => void;
  setWidgetChart: Dispatch<SetStateAction<Key | undefined>>;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" startContent={<Plus />}>
          Add widget
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        className="w-fit"
        onAction={(key) => (AddWidgetModalHandler(), setWidgetChart(key))}
      >
        <DropdownItem
          key="DataChart"
          className="bg-gradient-to-br from-fuchsia-600 to-rose-600 h-12 text-2xl px-10 mb-2"
          startContent={<Axis3D />}
        >
          Data Chart
        </DropdownItem>
        <DropdownItem
          key="Calendar"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-12 text-2xl px-10"
          startContent={<Calendar />}
        >
          Calendar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
