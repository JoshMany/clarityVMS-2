import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { PenLine, Pipette, Settings2, Shapes } from "lucide-react";
import { Dispatch, Key, SetStateAction, useEffect, useState } from "react";

// await CreateChart({ dashboardUUID: activeDashboard });
// await mutate(`/api/charts?dashboard=${activeDashboard}`);

export default function ChartCreationModal({
  isModalOpen,
  setModalOpen,
  swrKey,
  activeKey,
}: {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  swrKey: string;
  activeKey: Key | undefined;
}) {
  const [ActiveSection, setActiveSection] = useState("WidgetType");

  const MenuSections = {
    DataCharts: {
      ChartType: { state: "enabled", label: "Chart Type" },
      ChartConfiguration: { state: "disabled", label: "Chart Configuration" },
      LastDetails: { state: "disabled", label: "Last Details" },
    },
  };

  const ActualConfigurations = {
    widgetType: undefined,
    widgetConfigurations: undefined,
  };

  // const ChartTypeArea = () => (
  //   <div className="w-full h-full grid grid-cols-2 grid-rows-4 text-center auto-rows-max mx-4 gap-4 ">
  //     <Button className=" h-28 text-2xl">Line Chart</Button>
  //     <Button className="bg-gradient-to-r from-red-600 to-orange-600 h-28 text-2xl">
  //       Bar Chart
  //     </Button>
  //     <Button className="bg-gradient-to-r from-amber-300 to-amber-500 h-28 text-2xl">
  //       Area Chart
  //     </Button>
  //     <Button className="bg-gradient-to-r from-purple-500 to-pink-500 h-28 text-2xl">
  //       Pie Chart
  //     </Button>
  //   </div>
  // );

  const ChartsMenu = () => (
    <Listbox className="w-40 h-full" defaultSelectedKeys={["ChartType"]}>
      <ListboxItem key="ChartType" startContent={<Shapes />}>
        Chart Type
      </ListboxItem>
      <ListboxItem key="WidgetConfiguration" startContent={<Settings2 />}>
        Chart Configuration
      </ListboxItem>
      <ListboxItem key="LastDetails" startContent={<Pipette />}>
        Last Details
      </ListboxItem>
    </Listbox>
  );
  const renderMenuByKey = (key: Key | undefined) => {
    switch (key?.toString()) {
      case "DataChart":
        return <ChartsMenu />;

      default:
        return (
          <Listbox className="w-40 h-full">
            <ListboxItem key={"WidgetType"} selectedIcon={<Shapes />}>
              Default
            </ListboxItem>
          </Listbox>
        );
    }
  };

  // const renderActiveSection = (param: string) => {
  //   switch (param) {
  //     case "WidgetType":
  //       return <ChartTypeArea />;
  //     case "Chart Type":
  //       return <div>Chart Type</div>;

  //     default:
  //       break;
  //   }
  // };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={setModalOpen}
      size="5xl"
      className="min-h-[65%] max-h-[65%]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody className="p-0 m-0">
              <div className="flex flex-row">
                {renderMenuByKey(activeKey)}
                <Divider orientation="vertical" className="h-auto" />
                {/* {renderActiveSection(ActiveSection)} */}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
