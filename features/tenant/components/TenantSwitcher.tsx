'use client'

import { Building2, ChevronDown, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTenantStore } from '@/features/tenant/store/tenant.store'
import { cn } from '@/utils/cn'

export function TenantSwitcher() {
  const { activeTenant, availableTenants, setActiveTenant } = useTenantStore()

  if (!activeTenant) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Building2 className="h-4 w-4" />
        <span>No tenant selected</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white uppercase">
            {activeTenant.name.charAt(0)}
          </div>
          <span className="font-medium">{activeTenant.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
          Switch tenant
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {availableTenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            className="flex items-center justify-between gap-2 cursor-pointer"
            onClick={() => setActiveTenant(tenant)}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                {tenant.name.charAt(0)}
              </div>
              <span className="text-sm">{tenant.name}</span>
            </div>
            {tenant.id === activeTenant.id && (
              <Check className="h-3.5 w-3.5 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
