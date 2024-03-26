import { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "./SelectSeller.module.scss";
import getSeller from "@/routes/getSeller";
import { useUserContext } from "@/context/userContext";
import { useSellerContext } from "@/context/sellerContext";

interface SA3{
   A3_COD:string
   A3_NOME:string
}

export default function SelectSeller() {
  const [option, setOption] = useState<SA3[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const {user} = useUserContext()
  const {handlerSeller,seller} = useSellerContext()

  const dataFetch = useCallback(async () => {
    if (!user) return;
    const data = await getSeller(user.code);
    if (Array.isArray(data)) {
      setOption(data);
    }
  }, [user]);

  useEffect(() => {
    dataFetch();
  }, [dataFetch]);

  const handleChange = (e:ChangeEvent<HTMLSelectElement>) => {
      handlerSeller(e.target.value)
      setSelectedOption(e.target.value)
   };
  return (
    <div className={styles.divDropdown}>
      <select 
         className={styles.dropdown}
         onChange={handleChange}
         value={selectedOption}
      >
        <option value="">Selecione um Vendedor</option>
        {option.map((el) => (
          <option value={el.A3_COD.trim()} key={el.A3_COD.trim()}>
            {el.A3_NOME.trim()}
          </option>
        ))}
      </select>
    </div>
  );
}
