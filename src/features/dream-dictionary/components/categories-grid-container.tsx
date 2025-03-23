"use client";

import { memo } from "react";

import { CategoryGroup } from "../types";
import CategoryCard from "./category-card";
import CategoryCardSkeleton from "./category-card-skeleton";

const CategoriesGrid = memo(
  ({ data, loading }: { data: CategoryGroup[]; loading: boolean }) => {
    if (loading) {
      return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((group) => (
          <CategoryCard
            key={group.category._id}
            category={group.category}
            pages={group}
          />
        ))}
      </div>
    );
  }
);

CategoriesGrid.displayName = "CategoriesGrid";

export default function CategoriesContainer({
  data,
  loading,
}: {
  data: CategoryGroup[];
  loading: boolean;
}) {
  return <CategoriesGrid data={data} loading={loading} />;
}
