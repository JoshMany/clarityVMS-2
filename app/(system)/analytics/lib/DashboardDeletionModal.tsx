import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useDashboardState } from "@/store/analytics";
import { DeleteDashboard } from "./actions";

export default function DashboardDeletionModal({
  isDeletionModalActive,
  setDeletionModalActive,
  swrKey,
  activeDashboard,
}: {
  isDeletionModalActive: boolean;
  setDeletionModalActive: Dispatch<SetStateAction<boolean>>;
  swrKey: string;
  activeDashboard: string;
}) {
  const { updateActiveDashboard } = useDashboardState();
  const { mutate } = useSWRConfig();

  const deleteDashboard = async (): Promise<string> => {
    const DashboardDeletedResponse = await DeleteDashboard({
      dashboardUUID: activeDashboard,
    });

    if (DashboardDeletedResponse.status === true) {
      const AllDashboards = await axios.get(swrKey);

      const ActiveDashboardIndex = AllDashboards.data.findIndex(
        (obj: { uuid: string }) => obj.uuid === activeDashboard
      );

      if (ActiveDashboardIndex <= 0) {
        updateActiveDashboard({
          uuid: AllDashboards.data[ActiveDashboardIndex + 1].uuid,
        });
      } else {
        updateActiveDashboard({
          uuid: AllDashboards.data[ActiveDashboardIndex - 1].uuid,
        });
      }
      await mutate(swrKey);
    }

    return DashboardDeletedResponse.message;
  };

  return (
    <Modal isOpen={isDeletionModalActive} onOpenChange={setDeletionModalActive}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Danger</ModalHeader>
            <ModalBody>
              <p className="font-bold text-left mb-4">
                You&apos;re about to delete this dashboard.
              </p>

              <p>
                This action will delete all the widgets inside the dashboard and
                their configurations.
              </p>
              <p className="mt-4">Please, confirm this action.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="danger"
                onPress={() => (
                  onClose(),
                  toast.promise(deleteDashboard, {
                    loading: "Deleting dashboard...",
                    success: (dashboardDeleteRes: string) => {
                      return dashboardDeleteRes;
                    },
                    error: (dashboardDeleteRes: string) => {
                      return dashboardDeleteRes;
                    },
                  })
                )}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
