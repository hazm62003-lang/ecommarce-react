"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { api, apiError } from "@/lib/api/client";
import { addressSchema } from "@/lib/validators";
import type { Address } from "@/types";
import type { z } from "zod";

export function AddressesView() {
  let qc = useQueryClient();
  let [adding, setAdding] = useState(false);
  let list = useQuery({ queryKey: ["addresses"], queryFn: async () => (await api.get<{ data: Address[] }>("/v1/addresses")).data.data });
  let { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof addressSchema>>({ resolver: zodResolver(addressSchema) });

  let add = useMutation({
    mutationFn: (v: z.infer<typeof addressSchema>) => api.post("/v1/addresses", v),
    onSuccess: () => { toast.success("Address added"); reset(); setAdding(false); qc.invalidateQueries({ queryKey: ["addresses"] }); },
    onError: (e) => toast.error(apiError(e, "Could not add the address")),
  });
  let del = useMutation({
    mutationFn: (id: string) => api.delete(`/v1/addresses/${id}`),
    onSuccess: () => { toast.success("Address removed"); qc.invalidateQueries({ queryKey: ["addresses"] }); },
    onError: (e) => toast.error(apiError(e, "Could not remove the address")),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-ink-500">Manage your saved delivery addresses</p>
        <Button onClick={() => setAdding((v) => !v)}><Plus className="h-4 w-4" />Add Address</Button>
      </div>

      {adding && (
        <form onSubmit={handleSubmit((v) => add.mutate(v))} className="grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2" noValidate>
          <FormField label="Name" htmlFor="a-name" error={errors.name?.message}><Input id="a-name" placeholder="Home" {...register("name")} /></FormField>
          <FormField label="City" htmlFor="a-city" error={errors.city?.message}><Input id="a-city" {...register("city")} /></FormField>
          <div className="sm:col-span-2"><FormField label="Address Details" htmlFor="a-details" error={errors.details?.message}><Input id="a-details" {...register("details")} /></FormField></div>
          <FormField label="Phone" htmlFor="a-phone" error={errors.phone?.message}><Input id="a-phone" type="tel" placeholder="01xxxxxxxxx" {...register("phone")} /></FormField>
          <div className="flex items-end"><Button type="submit" disabled={add.isPending}>{add.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save Address</Button></div>
        </form>
      )}

      {list.isLoading ? <Skeleton className="h-32" /> : list.isError ? <p className="text-destructive">Could not load addresses.</p> : !list.data?.length ? (
        <EmptyState title="No saved addresses" text="Add an address to check out faster." cta="Browse products" />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.data.map((a) => (
            <li key={a._id} className="flex items-start gap-3 rounded-xl border bg-white p-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div className="flex-1 text-sm"><p className="font-semibold text-ink-900">{a.name} · {a.city}</p><p className="text-ink-600">{a.details}</p><p className="text-ink-600">{a.phone}</p></div>
              <Button variant="ghost" size="icon" aria-label="Delete address" disabled={del.isPending} onClick={() => del.mutate(a._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
