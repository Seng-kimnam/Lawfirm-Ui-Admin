import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";

interface TableFooterProps {
  children: ReactNode;
  className?: string;
}
const TableFooter: React.FC<TableFooterProps> = ({ children, className }) => {
  return <tfoot className={className}>{children}</tfoot>;
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell
};
