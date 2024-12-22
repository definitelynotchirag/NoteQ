"use client";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Breadcrumbs = () => {
  const path = usePathname();

  const segments = path.split("/");
  return (
    <div>
      <Breadcrumb >
        <BreadcrumbList className="text-white">
          <BreadcrumbItem className="text-white">
            <BreadcrumbLink className="text-white hover:text-gray-600" href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => {
            if (!segment) return null;
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            return (
              <Fragment key={segment} >
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-white hover:text-gray-600" >
                  {isLast ? (
                    <BreadcrumbPage className="text-white hover:text-gray-600">{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="text-white hover:text-gray-600" href={href}>{segment}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
