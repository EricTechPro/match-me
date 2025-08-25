import React from "react";
import { getMembers } from "../actions/memberActions";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import { GetMemberParams } from "@/types";
import EmptyState from "@/components/EmptyState";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: GetMemberParams;
}) {
  const { items: members, totalCount } =
    await getMembers(searchParams);

  const likeIds = await fetchCurrentUserLikeIds();

  if (members.length === 0) return <EmptyState />;

  return (
    <>
      <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-8">
        {members &&
          members.map((member) => (
            <MemberCard
              member={member}
              key={member.id}
              likeIds={likeIds}
            />
          ))}
      </div>
      <PaginationComponent
        totalCount={totalCount}
      />
    </>
  );
}
