"use client";
import {
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Divider,
  useDisclosure,
  DropdownSection,
} from "@nextui-org/react";
import { Settings, FileBox, Trash, BookCopy, Pencil } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { useDashboardState } from "@/store/analytics";
import { Key, useEffect, useLayoutEffect, useState } from "react";
import { fetcher } from "@/libs/fetcher";
import { useTitle } from "@/app/components/Layout/LayoutStructure";
import DashboardCreationModal from "../lib/DashboardCreationModal";
import DashboardDeletionModal from "../lib/DashboardDeletionModal";
import DashboardRenameModal from "../lib/DashboardRenameModal";
import { DuplicateDashboard } from "../lib/actions";
import { toast } from "sonner";
import ChartCreationModal from "../lib/ChartCreationModal";
import AddChartDropdown from "./AddChartDropdown";

export const Toolsbar = ({
  userUUID,
  prefetchedDashboards,
}: {
  userUUID: string;
  prefetchedDashboards: any[];
}) => {
  //Zustand States
  const { activeDashboard, updateActiveDashboard } = useDashboardState();
  const { updateTitle } = useTitle();

  // Modal's handlers
  const {
    isOpen: isDashboardModalOpen,
    onOpen: onNewDashboardModalOpen,
    onOpenChange: onNewDashboardModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeletionModalOpen,
    onOpenChange: onDeletionModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRenameModalOpen,
    onOpenChange: onRenameModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isAddChartModalOpen,
    onOpenChange: onAddChartModalOpenChange,
  } = useDisclosure();

  // States
  const [dashboardsSelectOpen, setDashboardsSelectOpen] = useState<boolean>(
    false
  );
  const [widgetType, setWidgetType] = useState<Key>();

  const dashboardSwrKey = `/api/dashboards?owner=${userUUID}`;

  const { data: dashboards } = useSWR(dashboardSwrKey, fetcher, {
    fallbackData: prefetchedDashboards,
  });
  const { mutate } = useSWRConfig();

  useLayoutEffect(() => {
    updateTitle("Analytics");
  }, []);

  useEffect(() => {
    const uuid = dashboards[0].uuid;
    updateActiveDashboard({ uuid: uuid });
  }, []);

  const handleSettingsAction = async (key: string) => {
    switch (key) {
      case "export":
        console.log(key);
        break;
      case "delete":
        onDeletionModalOpenChange();
        break;
      case "duplicate":
        toast.promise(
          DuplicateDashboard({
            dashboardUUID: activeDashboard,
          }),
          {
            loading: "Deleting dashboard...",
            success: async (
              duplicatedDashboard:
                | {
                    message: string;
                    status: boolean;
                    duplicatedDashboardUUID: string;
                  }
                | {
                    message: string;
                    status: boolean;
                    duplicatedDashboardUUID?: undefined;
                  }
            ) => {
              await mutate(dashboardSwrKey);
              if (duplicatedDashboard.duplicatedDashboardUUID)
                updateActiveDashboard({
                  uuid: duplicatedDashboard.duplicatedDashboardUUID,
                });
              return duplicatedDashboard.message;
            },
            error: (
              duplicatedDashboard:
                | {
                    message: string;
                    status: boolean;
                    duplicatedDashboardUUID: string;
                  }
                | {
                    message: string;
                    status: boolean;
                    duplicatedDashboardUUID?: undefined;
                  }
            ) => {
              return duplicatedDashboard.message;
            },
          }
        );
        break;
      case "rename":
        onRenameModalOpenChange();
        break;
    }
  };

  return (
    <div className="sticky top-0 z-50 ">
      <div className="bg-background w-full pt-2 flex flex-row justify-between items-center pb-3">
        <Select
          isOpen={dashboardsSelectOpen}
          onOpenChange={(open) =>
            open !== dashboardsSelectOpen && setDashboardsSelectOpen(open)
          }
          aria-label="Dashboard selection"
          placeholder="Select an dashboard"
          labelPlacement="outside"
          variant="bordered"
          showScrollIndicators={true}
          size="lg"
          listboxProps={{
            bottomContent: (
              <Button
                color="warning"
                className="sticky bottom-0"
                onPress={() => (
                  onNewDashboardModalOpen(), setDashboardsSelectOpen(false)
                )}
              >
                Add dashboard
              </Button>
            ),
          }}
          selectionMode="single"
          selectedKeys={[activeDashboard]}
          className="max-w-xs text-4xl"
          disallowEmptySelection
          onSelectionChange={(e: any) =>
            updateActiveDashboard({ uuid: e.currentKey })
          }
        >
          {dashboards?.map(
            (dashboard: { uuid: string; dashboard_name: string }) => (
              <SelectItem key={dashboard.uuid} value={dashboard.uuid}>
                {dashboard.dashboard_name}
              </SelectItem>
            )
          )}
        </Select>
        <div className="flex flex-row items-center gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly aria-label="Settings" variant="ghost">
                <Settings />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Action event example"
              onAction={(key) => handleSettingsAction(key as string)}
            >
              <DropdownSection title="Actions">
                <DropdownItem
                  key="export"
                  description="Export the data from your charts in the active dashboard."
                  startContent={<FileBox />}
                >
                  Export
                </DropdownItem>
                <DropdownItem
                  key="rename"
                  description="Rename the active dashboard."
                  startContent={<Pencil />}
                >
                  Rename
                </DropdownItem>
                <DropdownItem
                  key="duplicate"
                  description="Create a new dashboard exactly like the active one."
                  startContent={<BookCopy />}
                >
                  Duplicate
                </DropdownItem>
              </DropdownSection>
              <DropdownSection title="Danger zone">
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  description="Delete the active dashboard."
                  startContent={<Trash />}
                >
                  Delete
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
          <AddChartDropdown
            AddWidgetModalHandler={onAddChartModalOpenChange}
            setWidgetChart={setWidgetType}
          />
        </div>
      </div>
      <Divider orientation="horizontal" />
      <ChartCreationModal
        isModalOpen={isAddChartModalOpen}
        setModalOpen={onAddChartModalOpenChange}
        activeKey={widgetType}
        swrKey={""}
      />
      <DashboardCreationModal
        isModalOpen={isDashboardModalOpen}
        setModalOpen={onNewDashboardModalOpenChange}
        swrKey={dashboardSwrKey}
      />
      <DashboardDeletionModal
        isDeletionModalActive={isDeletionModalOpen}
        setDeletionModalActive={onDeletionModalOpenChange}
        swrKey={dashboardSwrKey}
        activeDashboard={activeDashboard}
      />
      <DashboardRenameModal
        isRenameModalStatus={isRenameModalOpen}
        setRenameModalStatus={onRenameModalOpenChange}
        swrKey={dashboardSwrKey}
      />
    </div>
  );
};
