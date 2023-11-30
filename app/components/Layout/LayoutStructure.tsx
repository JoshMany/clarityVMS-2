"use client";
import {
  PersonStanding,
  LayoutDashboard,
  FolderKanban,
  HelpCircle,
  LogOut,
  Settings,
  Search,
  LayoutGrid,
  User,
} from "lucide-react";
import {
  Avatar,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { create } from "zustand";

type TitleState = {
  PageTitle: string;
  updateTitle: (title: string) => void;
};

type UserState = {
  Username: string;
  UserRole: string;
  updateUsername: (Username: UserState["Username"]) => void;
  updateRole: (UserRole: UserState["UserRole"]) => void;
};

export const useTitle = create<TitleState>()((set) => ({
  PageTitle: "Page",
  updateTitle: (Title: string) => set({ PageTitle: Title }),
}));

export const useUserDetail = create<UserState>()((set) => ({
  Username: "",
  UserRole: "",
  updateUsername: (Username: string) => set(() => ({ Username: Username })),
  updateRole: (UserRole: string) => set(() => ({ UserRole: UserRole })),
}));

export default function LayoutStructure({
  children,
}: {
  children: React.ReactNode;
}) {
  const { PageTitle } = useTitle();
  const { updateRole, updateUsername, UserRole, Username } = useUserDetail();
  const { push } = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (status == "authenticated" && session.user != (undefined || null)) {
      const userName = session?.user?.name!;
      const role = String(session?.user?.rol)!;
      updateUsername(userName);
      updateRole(role);
    }
  }, [session]);

  const AsideBtn = ({
    TooltipHeader,
    TooltipContent,
    Icon,
    Path,
  }: {
    TooltipHeader: string;
    TooltipContent: string;
    Icon: ReactNode;
    Path: string;
  }) => (
    <Tooltip
      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold">{TooltipHeader}</div>
          <div className="text-tiny">{TooltipContent}</div>
        </div>
      }
      placement="right"
    >
      <Button
        isIconOnly
        color="default"
        aria-label="Dashboard"
        onPress={(e) => push(Path)}
      >
        {Icon}
      </Button>
    </Tooltip>
  );

  return (
    <>
      <Toaster
        closeButton={true}
        toastOptions={{
          style: {
            backgroundColor: `${resolvedTheme === "light" ? "white" : "black"}`,
            color: `${resolvedTheme === "light" ? "black" : "white"}`,
          },
        }}
      />
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden sm:flex w-auto overflow-y-auto flex-col justify-between mx-2 my-2">
            <div className="flex flex-col gap-3 justify-stretch">
              <Button
                isIconOnly
                color="default"
                aria-label="Dashboard"
                variant="light"
                onPress={() => push("/")}
              >
                <PersonStanding />
              </Button>

              <AsideBtn
                Icon={<LayoutDashboard />}
                TooltipContent="Visualize, create, edit and review data charts."
                TooltipHeader="Analytics"
                Path="/analytics"
              />

              <AsideBtn
                Icon={<FolderKanban />}
                TooltipContent="Visualize, create, edit and review data charts."
                TooltipHeader="Job Requisitions"
                Path="/jobReqs"
              />

              <AsideBtn
                Icon={<User />}
                TooltipContent="Checkout the User's data."
                TooltipHeader="Users"
                Path="/users"
              />
            </div>

            <Tooltip
              content={
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Help</div>
                  <div className="text-tiny">
                    Check the documentation, learn how to use the system and
                    review examples.
                  </div>
                </div>
              }
              placement="right"
            >
              <Button isIconOnly color="default" aria-label="Dashboard">
                <HelpCircle />
              </Button>
            </Tooltip>
          </aside>

          <div className="flex-1 h-screen">
            <nav className="flex h-12 items-center w-full px-4 font-bold text-inherit justify-between">
              {PageTitle}
              <div className="flex flex-row gap-2 items-center">
                <Button
                  isIconOnly
                  color="default"
                  aria-label="Search"
                  variant="light"
                  onPress={onOpen}
                >
                  <Search />
                </Button>
                <Popover
                  showArrow
                  offset={10}
                  placement="bottom"
                  backdrop={"opaque"}
                >
                  <PopoverTrigger>
                    <Avatar size="sm" isBordered radius="sm" showFallback />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">{Username}</div>
                      <div className="text-tiny">{UserRole}</div>
                      <Divider orientation="horizontal" className="my-2" />
                      <div className="flex flex-col gap-2 mt-2">
                        <ThemeSwitcher />
                        <Button
                          size="sm"
                          className="w-full"
                          startContent={<Settings />}
                        >
                          Settings
                        </Button>
                        <Button
                          className="w-full"
                          color="danger"
                          size="sm"
                          variant="ghost"
                          startContent={<LogOut />}
                          onPress={() => signOut()}
                        >
                          Log Out
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </nav>
            {/* <div className="flex bg-pink-300 h-8 items-center">
            Full Width Subheader{" "}
          </div> */}
            <main className="flex flex-1 paragraph mx-4">{children}</main>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Search</ModalHeader>
              <ModalBody>
                <Input
                  size="lg"
                  variant="bordered"
                  placeholder="Type something to search..."
                />
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full text-left"
                    size="sm"
                    radius="sm"
                    variant="light"
                    startContent={<LayoutGrid />}
                  >
                    Result 1
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
