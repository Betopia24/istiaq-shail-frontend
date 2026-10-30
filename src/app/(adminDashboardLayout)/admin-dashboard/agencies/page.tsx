"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  UserCheck,
  UserX,
  Shield,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AgentRecord {
  id: string;
  name: string;
  email: string;
  initials: string;
  agency: string;
  role: "Senior Agent" | "Agency Owner" | "Junior Agent";
  packsCount: number;
  status: "ACTIVE" | "SUSPENDED";
}

const initialAgents: AgentRecord[] = [
  {
    id: "ag-1",
    name: "Sarah Jenkins",
    email: "sarah@prestigeestates.co.uk",
    initials: "SJ",
    agency: "Prestige Estates UK",
    role: "Senior Agent",
    packsCount: 48,
    status: "ACTIVE",
  },
  {
    id: "ag-2",
    name: "David Harrison",
    email: "david@harrison.co.uk",
    initials: "DH",
    agency: "Harrison Residential",
    role: "Agency Owner",
    packsCount: 12,
    status: "ACTIVE",
  },
  {
    id: "ag-3",
    name: "Eleanor Vance",
    email: "eleanor@vanceprestige.com",
    initials: "EV",
    agency: "Vance Prestige Group",
    role: "Senior Agent",
    packsCount: 64,
    status: "ACTIVE",
  },
  {
    id: "ag-4",
    name: "Charles Pemberton",
    email: "c.pemberton@cheshireelite.co.uk",
    initials: "CP",
    agency: "Cheshire Elite Properties",
    role: "Agency Owner",
    packsCount: 19,
    status: "SUSPENDED",
  },
  {
    id: "ag-5",
    name: "Amanda Lewis",
    email: "amanda@didsburyprime.com",
    initials: "AL",
    agency: "Didsbury Prime Group",
    role: "Junior Agent",
    packsCount: 8,
    status: "ACTIVE",
  },
  {
    id: "ag-6",
    name: "Robert Sterling",
    email: "robert@sterlingprime.co.uk",
    initials: "RS",
    agency: "Sterling Prime Estates",
    role: "Senior Agent",
    packsCount: 34,
    status: "ACTIVE",
  },
];

export default function AgenciesAndUsersPage() {
  const [agents, setAgents] = useState<AgentRecord[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (id: string, name: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          showToast(
            newStatus === "SUSPENDED"
              ? `Access suspended for ${name}`
              : `Access restored for ${name}`,
          );
          return { ...a, status: newStatus };
        }
        return a;
      }),
    );
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agency.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole =
        roleFilter === "All"
          ? true
          : roleFilter === "Suspended"
            ? agent.status === "SUSPENDED"
            : agent.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [agents, searchQuery, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#E8A808]/40 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#E8A808]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
              Demo data
            </span>
            <span className="text-xs text-slate-400">
              · 6 Sample Institutional Agent Accounts
            </span>
          </div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Agency Teams &amp; User Access Control
          </h1>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent name, email, or agency..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#092167] transition cursor-pointer"
            >
              <option value="All">Filter Role: All Agents</option>
              <option value="Agency Owner">Agency Owner</option>
              <option value="Senior Agent">Senior Agent</option>
              <option value="Junior Agent">Junior Agent</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Agents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200/70 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">User / Agent Name</th>
                <th className="px-6 py-4">Agency Affiliation</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Packs Created</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No agents found matching your query.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* User / Agent */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {agent.initials}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 leading-tight">
                            {agent.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {agent.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Agency */}
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {agent.agency}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {agent.role === "Agency Owner" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                          Agency Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {agent.role}
                        </span>
                      )}
                    </td>

                    {/* Packs Created */}
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {agent.packsCount} Packs
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {agent.status === "ACTIVE" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/50">
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {agent.status === "ACTIVE" ? (
                        <button
                          onClick={() =>
                            handleToggleStatus(agent.id, agent.name)
                          }
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleToggleStatus(agent.id, agent.name)
                          }
                          className="text-xs font-medium text-amber-600 hover:text-amber-800 hover:underline transition"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredAgents.length}</strong> of{" "}
            <strong>{agents.length}</strong> agents
          </span>
          <span className="text-slate-400">Database live sync active</span>
        </div>
      </div>
    </div>
  );
}
