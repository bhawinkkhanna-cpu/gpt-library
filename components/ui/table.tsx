import * as React from "react"
export const Table = (p: React.HTMLAttributes<HTMLTableElement>) => <table className={`table ${p.className||""}`} {...p}/>
export const TableHeader = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...p}/>
export const TableBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p}/>
export const TableRow = (p: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...p}/>
export const TableHead = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => <th {...p}/>
export const TableCell = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...p}/>
