"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";

function BreadcrumbListItem({
  path,
  index,
  length,
  href,
}: {
  path: string;
  index: number;
  length: number;
  href: string;
}) {
  return (
    <>
      <BreadcrumbSeparator className="hidden md:block" />
      <BreadcrumbItem>
        {index === length - 1 ? (
          <BreadcrumbPage>{capitalizeFirstLetter(path)}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>
            {capitalizeFirstLetter(path)}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}

export default function NavBreadcrumbs() {
  const paths = usePathname().split("/").filter(Boolean);

  if (paths.length < 2) {
    return null;
  }
  const dashboardPath = `/${paths[0]}/${paths[1]}`;

  if (paths.length < 3) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={dashboardPath}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {paths.slice(2).map((path, index) => {
          let href = `/${paths.slice(0, index + 3).join("/")}`;
          return (
            <BreadcrumbListItem
              key={index}
              path={path}
              index={index}
              length={paths.length - 2}
              href={href}
            />
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
