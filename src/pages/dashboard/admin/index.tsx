import Menu from "@/components/Menu/Menu";
import style from "../../../sass/Dashboard.module.scss";
import useUser from "@/hook/useUser";
import { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/router";
import AdminContents from "@/components/AdminContents/AdminContents";
export default function Admin() {
  const { user } = useUserContext();
  const route = useRouter();
  useUser();
  useEffect(() => {
    if (user) {
      if (!user.admin) {
        route.push("/Dashboard");
      }
    }
  });
  return (
    <main className={style.main_content}>
      <Menu />
      <AdminContents/>
    </main>
  );
}
