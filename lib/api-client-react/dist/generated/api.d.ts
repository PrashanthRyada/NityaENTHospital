import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Achievement, AchievementInput, AchievementUpdate, AdminOverview, AdminSession, Appointment, AppointmentInput, AppointmentUpdate, Doctor, DoctorInput, DoctorUpdate, ErrorEnvelope, EventInput, EventUpdate, GoogleReviews, HealthStatus, HospitalEvent, MediaInput, MediaItem, MediaUpdate, UploadUrlRequest, UploadUrlResponse } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublicDoctorsUrl: () => string;
/**
 * @summary List active doctors and their availability
 */
export declare const listPublicDoctors: (options?: Parameters<typeof customFetch>[1]) => Promise<Doctor[]>;
export declare const getListPublicDoctorsQueryKey: () => readonly ["/api/public/doctors"];
export declare const getListPublicDoctorsQueryOptions: <TData = Awaited<ReturnType<typeof listPublicDoctors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicDoctors>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicDoctorsQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicDoctors>>>;
export type ListPublicDoctorsQueryError = ErrorType<unknown>;
/**
 * @summary List active doctors and their availability
 */
export declare function useListPublicDoctors<TData = Awaited<ReturnType<typeof listPublicDoctors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublicEventsUrl: () => string;
/**
 * @summary List published hospital events
 */
export declare const listPublicEvents: (options?: Parameters<typeof customFetch>[1]) => Promise<HospitalEvent[]>;
export declare const getListPublicEventsQueryKey: () => readonly ["/api/public/events"];
export declare const getListPublicEventsQueryOptions: <TData = Awaited<ReturnType<typeof listPublicEvents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicEventsQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicEvents>>>;
export type ListPublicEventsQueryError = ErrorType<unknown>;
/**
 * @summary List published hospital events
 */
export declare function useListPublicEvents<TData = Awaited<ReturnType<typeof listPublicEvents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublicAchievementsUrl: () => string;
/**
 * @summary List published hospital achievements
 */
export declare const listPublicAchievements: (options?: Parameters<typeof customFetch>[1]) => Promise<Achievement[]>;
export declare const getListPublicAchievementsQueryKey: () => readonly ["/api/public/achievements"];
export declare const getListPublicAchievementsQueryOptions: <TData = Awaited<ReturnType<typeof listPublicAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicAchievements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicAchievementsQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicAchievements>>>;
export type ListPublicAchievementsQueryError = ErrorType<unknown>;
/**
 * @summary List published hospital achievements
 */
export declare function useListPublicAchievements<TData = Awaited<ReturnType<typeof listPublicAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublicMediaUrl: () => string;
/**
 * @summary List published public media items
 */
export declare const listPublicMedia: (options?: Parameters<typeof customFetch>[1]) => Promise<MediaItem[]>;
export declare const getListPublicMediaQueryKey: () => readonly ["/api/public/media"];
export declare const getListPublicMediaQueryOptions: <TData = Awaited<ReturnType<typeof listPublicMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicMedia>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicMediaQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicMedia>>>;
export type ListPublicMediaQueryError = ErrorType<unknown>;
/**
 * @summary List published public media items
 */
export declare function useListPublicMedia<TData = Awaited<ReturnType<typeof listPublicMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetGoogleReviewsUrl: () => string;
/**
 * @summary Return Google review source and available review data
 */
export declare const getGoogleReviews: (options?: Parameters<typeof customFetch>[1]) => Promise<GoogleReviews>;
export declare const getGetGoogleReviewsQueryKey: () => readonly ["/api/public/reviews"];
export declare const getGetGoogleReviewsQueryOptions: <TData = Awaited<ReturnType<typeof getGoogleReviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGoogleReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGoogleReviews>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGoogleReviewsQueryResult = NonNullable<Awaited<ReturnType<typeof getGoogleReviews>>>;
export type GetGoogleReviewsQueryError = ErrorType<unknown>;
/**
 * @summary Return Google review source and available review data
 */
export declare function useGetGoogleReviews<TData = Awaited<ReturnType<typeof getGoogleReviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGoogleReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAppointmentUrl: () => string;
/**
 * @summary Request an appointment
 */
export declare const createAppointment: (appointmentInput: AppointmentInput, options?: Parameters<typeof customFetch>[1]) => Promise<Appointment>;
export declare const getCreateAppointmentMutationKey: () => readonly ["createAppointment"];
export declare const getCreateAppointmentMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, CreateAppointmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, CreateAppointmentMutationVariables, TContext>;
export type CreateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof createAppointment>>>;
export type CreateAppointmentMutationBody = BodyType<AppointmentInput>;
export type CreateAppointmentMutationError = ErrorType<ErrorEnvelope>;
export type CreateAppointmentMutationVariables = {
    data: BodyType<AppointmentInput>;
};
/**
* @summary Request an appointment
*/
export declare const useCreateAppointment: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, CreateAppointmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAppointment>>, TError, CreateAppointmentMutationVariables, TContext>;
export declare const getGetAdminSessionUrl: () => string;
/**
 * @summary Check whether the signed-in user is an authorized hospital administrator
 */
export declare const getAdminSession: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
export declare const getGetAdminSessionQueryKey: () => readonly ["/api/admin/session"];
export declare const getGetAdminSessionQueryOptions: <TData = Awaited<ReturnType<typeof getAdminSession>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminSession>>>;
export type GetAdminSessionQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Check whether the signed-in user is an authorized hospital administrator
 */
export declare function useGetAdminSession<TData = Awaited<ReturnType<typeof getAdminSession>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAdminOverviewUrl: () => string;
/**
 * @summary Get management dashboard counts
 */
export declare const getAdminOverview: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminOverview>;
export declare const getGetAdminOverviewQueryKey: () => readonly ["/api/admin/overview"];
export declare const getGetAdminOverviewQueryOptions: <TData = Awaited<ReturnType<typeof getAdminOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOverview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminOverview>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminOverviewQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminOverview>>>;
export type GetAdminOverviewQueryError = ErrorType<unknown>;
/**
 * @summary Get management dashboard counts
 */
export declare function useGetAdminOverview<TData = Awaited<ReturnType<typeof getAdminOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOverview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAdminAppointmentsUrl: () => string;
/**
 * @summary List appointment requests
 */
export declare const listAdminAppointments: (options?: Parameters<typeof customFetch>[1]) => Promise<Appointment[]>;
export declare const getListAdminAppointmentsQueryKey: () => readonly ["/api/admin/appointments"];
export declare const getListAdminAppointmentsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminAppointments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminAppointments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminAppointmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminAppointments>>>;
export type ListAdminAppointmentsQueryError = ErrorType<unknown>;
/**
 * @summary List appointment requests
 */
export declare function useListAdminAppointments<TData = Awaited<ReturnType<typeof listAdminAppointments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAppointmentUrl: (id: number) => string;
/**
 * @summary Change appointment status
 */
export declare const updateAppointment: (id: number, appointmentUpdate: AppointmentUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Appointment>;
export declare const getUpdateAppointmentMutationKey: () => readonly ["updateAppointment"];
export declare const getUpdateAppointmentMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, UpdateAppointmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, UpdateAppointmentMutationVariables, TContext>;
export type UpdateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAppointment>>>;
export type UpdateAppointmentMutationBody = BodyType<AppointmentUpdate>;
export type UpdateAppointmentMutationError = ErrorType<ErrorEnvelope>;
export type UpdateAppointmentMutationVariables = {
    id: number;
    data: BodyType<AppointmentUpdate>;
};
/**
* @summary Change appointment status
*/
export declare const useUpdateAppointment: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, UpdateAppointmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAppointment>>, TError, UpdateAppointmentMutationVariables, TContext>;
export declare const getListAdminDoctorsUrl: () => string;
/**
 * @summary List all doctor records
 */
export declare const listAdminDoctors: (options?: Parameters<typeof customFetch>[1]) => Promise<Doctor[]>;
export declare const getListAdminDoctorsQueryKey: () => readonly ["/api/admin/doctors"];
export declare const getListAdminDoctorsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminDoctors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminDoctors>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminDoctorsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminDoctors>>>;
export type ListAdminDoctorsQueryError = ErrorType<unknown>;
/**
 * @summary List all doctor records
 */
export declare function useListAdminDoctors<TData = Awaited<ReturnType<typeof listAdminDoctors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateDoctorUrl: () => string;
/**
 * @summary Add a doctor
 */
export declare const createDoctor: (doctorInput: DoctorInput, options?: Parameters<typeof customFetch>[1]) => Promise<Doctor>;
export declare const getCreateDoctorMutationKey: () => readonly ["createDoctor"];
export declare const getCreateDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, CreateDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, CreateDoctorMutationVariables, TContext>;
export type CreateDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof createDoctor>>>;
export type CreateDoctorMutationBody = BodyType<DoctorInput>;
export type CreateDoctorMutationError = ErrorType<unknown>;
export type CreateDoctorMutationVariables = {
    data: BodyType<DoctorInput>;
};
/**
* @summary Add a doctor
*/
export declare const useCreateDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, CreateDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDoctor>>, TError, CreateDoctorMutationVariables, TContext>;
export declare const getUpdateDoctorUrl: (id: number) => string;
/**
 * @summary Update a doctor or their availability
 */
export declare const updateDoctor: (id: number, doctorUpdate: DoctorUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Doctor>;
export declare const getUpdateDoctorMutationKey: () => readonly ["updateDoctor"];
export declare const getUpdateDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, UpdateDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, UpdateDoctorMutationVariables, TContext>;
export type UpdateDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof updateDoctor>>>;
export type UpdateDoctorMutationBody = BodyType<DoctorUpdate>;
export type UpdateDoctorMutationError = ErrorType<unknown>;
export type UpdateDoctorMutationVariables = {
    id: number;
    data: BodyType<DoctorUpdate>;
};
/**
* @summary Update a doctor or their availability
*/
export declare const useUpdateDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, UpdateDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateDoctor>>, TError, UpdateDoctorMutationVariables, TContext>;
export declare const getDeleteDoctorUrl: (id: number) => string;
/**
 * @summary Remove a doctor
 */
export declare const deleteDoctor: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteDoctorMutationKey: () => readonly ["deleteDoctor"];
export declare const getDeleteDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, DeleteDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, DeleteDoctorMutationVariables, TContext>;
export type DeleteDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof deleteDoctor>>>;
export type DeleteDoctorMutationError = ErrorType<unknown>;
export type DeleteDoctorMutationVariables = {
    id: number;
};
/**
* @summary Remove a doctor
*/
export declare const useDeleteDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, DeleteDoctorMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteDoctor>>, TError, DeleteDoctorMutationVariables, TContext>;
export declare const getListAdminEventsUrl: () => string;
/**
 * @summary List all hospital events
 */
export declare const listAdminEvents: (options?: Parameters<typeof customFetch>[1]) => Promise<HospitalEvent[]>;
export declare const getListAdminEventsQueryKey: () => readonly ["/api/admin/events"];
export declare const getListAdminEventsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminEvents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminEventsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminEvents>>>;
export type ListAdminEventsQueryError = ErrorType<unknown>;
/**
 * @summary List all hospital events
 */
export declare function useListAdminEvents<TData = Awaited<ReturnType<typeof listAdminEvents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateEventUrl: () => string;
/**
 * @summary Create a hospital event
 */
export declare const createEvent: (eventInput: EventInput, options?: Parameters<typeof customFetch>[1]) => Promise<HospitalEvent>;
export declare const getCreateEventMutationKey: () => readonly ["createEvent"];
export declare const getCreateEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, CreateEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, CreateEventMutationVariables, TContext>;
export type CreateEventMutationResult = NonNullable<Awaited<ReturnType<typeof createEvent>>>;
export type CreateEventMutationBody = BodyType<EventInput>;
export type CreateEventMutationError = ErrorType<unknown>;
export type CreateEventMutationVariables = {
    data: BodyType<EventInput>;
};
/**
* @summary Create a hospital event
*/
export declare const useCreateEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, CreateEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createEvent>>, TError, CreateEventMutationVariables, TContext>;
export declare const getUpdateEventUrl: (id: number) => string;
/**
 * @summary Update a hospital event
 */
export declare const updateEvent: (id: number, eventUpdate: EventUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<HospitalEvent>;
export declare const getUpdateEventMutationKey: () => readonly ["updateEvent"];
export declare const getUpdateEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEvent>>, TError, UpdateEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateEvent>>, TError, UpdateEventMutationVariables, TContext>;
export type UpdateEventMutationResult = NonNullable<Awaited<ReturnType<typeof updateEvent>>>;
export type UpdateEventMutationBody = BodyType<EventUpdate>;
export type UpdateEventMutationError = ErrorType<unknown>;
export type UpdateEventMutationVariables = {
    id: number;
    data: BodyType<EventUpdate>;
};
/**
* @summary Update a hospital event
*/
export declare const useUpdateEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEvent>>, TError, UpdateEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateEvent>>, TError, UpdateEventMutationVariables, TContext>;
export declare const getDeleteEventUrl: (id: number) => string;
/**
 * @summary Delete a hospital event
 */
export declare const deleteEvent: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteEventMutationKey: () => readonly ["deleteEvent"];
export declare const getDeleteEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEvent>>, TError, DeleteEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteEvent>>, TError, DeleteEventMutationVariables, TContext>;
export type DeleteEventMutationResult = NonNullable<Awaited<ReturnType<typeof deleteEvent>>>;
export type DeleteEventMutationError = ErrorType<unknown>;
export type DeleteEventMutationVariables = {
    id: number;
};
/**
* @summary Delete a hospital event
*/
export declare const useDeleteEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEvent>>, TError, DeleteEventMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteEvent>>, TError, DeleteEventMutationVariables, TContext>;
export declare const getListAdminAchievementsUrl: () => string;
/**
 * @summary List all achievements
 */
export declare const listAdminAchievements: (options?: Parameters<typeof customFetch>[1]) => Promise<Achievement[]>;
export declare const getListAdminAchievementsQueryKey: () => readonly ["/api/admin/achievements"];
export declare const getListAdminAchievementsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminAchievements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminAchievementsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminAchievements>>>;
export type ListAdminAchievementsQueryError = ErrorType<unknown>;
/**
 * @summary List all achievements
 */
export declare function useListAdminAchievements<TData = Awaited<ReturnType<typeof listAdminAchievements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminAchievements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAchievementUrl: () => string;
/**
 * @summary Add an achievement
 */
export declare const createAchievement: (achievementInput: AchievementInput, options?: Parameters<typeof customFetch>[1]) => Promise<Achievement>;
export declare const getCreateAchievementMutationKey: () => readonly ["createAchievement"];
export declare const getCreateAchievementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAchievement>>, TError, CreateAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAchievement>>, TError, CreateAchievementMutationVariables, TContext>;
export type CreateAchievementMutationResult = NonNullable<Awaited<ReturnType<typeof createAchievement>>>;
export type CreateAchievementMutationBody = BodyType<AchievementInput>;
export type CreateAchievementMutationError = ErrorType<unknown>;
export type CreateAchievementMutationVariables = {
    data: BodyType<AchievementInput>;
};
/**
* @summary Add an achievement
*/
export declare const useCreateAchievement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAchievement>>, TError, CreateAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAchievement>>, TError, CreateAchievementMutationVariables, TContext>;
export declare const getUpdateAchievementUrl: (id: number) => string;
/**
 * @summary Update an achievement
 */
export declare const updateAchievement: (id: number, achievementUpdate: AchievementUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Achievement>;
export declare const getUpdateAchievementMutationKey: () => readonly ["updateAchievement"];
export declare const getUpdateAchievementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAchievement>>, TError, UpdateAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAchievement>>, TError, UpdateAchievementMutationVariables, TContext>;
export type UpdateAchievementMutationResult = NonNullable<Awaited<ReturnType<typeof updateAchievement>>>;
export type UpdateAchievementMutationBody = BodyType<AchievementUpdate>;
export type UpdateAchievementMutationError = ErrorType<unknown>;
export type UpdateAchievementMutationVariables = {
    id: number;
    data: BodyType<AchievementUpdate>;
};
/**
* @summary Update an achievement
*/
export declare const useUpdateAchievement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAchievement>>, TError, UpdateAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAchievement>>, TError, UpdateAchievementMutationVariables, TContext>;
export declare const getDeleteAchievementUrl: (id: number) => string;
/**
 * @summary Delete an achievement
 */
export declare const deleteAchievement: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteAchievementMutationKey: () => readonly ["deleteAchievement"];
export declare const getDeleteAchievementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAchievement>>, TError, DeleteAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAchievement>>, TError, DeleteAchievementMutationVariables, TContext>;
export type DeleteAchievementMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAchievement>>>;
export type DeleteAchievementMutationError = ErrorType<unknown>;
export type DeleteAchievementMutationVariables = {
    id: number;
};
/**
* @summary Delete an achievement
*/
export declare const useDeleteAchievement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAchievement>>, TError, DeleteAchievementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAchievement>>, TError, DeleteAchievementMutationVariables, TContext>;
export declare const getListAdminMediaUrl: () => string;
/**
 * @summary List media library items
 */
export declare const listAdminMedia: (options?: Parameters<typeof customFetch>[1]) => Promise<MediaItem[]>;
export declare const getListAdminMediaQueryKey: () => readonly ["/api/admin/media"];
export declare const getListAdminMediaQueryOptions: <TData = Awaited<ReturnType<typeof listAdminMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminMedia>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminMediaQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminMedia>>>;
export type ListAdminMediaQueryError = ErrorType<unknown>;
/**
 * @summary List media library items
 */
export declare function useListAdminMedia<TData = Awaited<ReturnType<typeof listAdminMedia>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminMedia>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateMediaUrl: () => string;
/**
 * @summary Add an uploaded image or video to the media library
 */
export declare const createMedia: (mediaInput: MediaInput, options?: Parameters<typeof customFetch>[1]) => Promise<MediaItem>;
export declare const getCreateMediaMutationKey: () => readonly ["createMedia"];
export declare const getCreateMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, CreateMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, CreateMediaMutationVariables, TContext>;
export type CreateMediaMutationResult = NonNullable<Awaited<ReturnType<typeof createMedia>>>;
export type CreateMediaMutationBody = BodyType<MediaInput>;
export type CreateMediaMutationError = ErrorType<unknown>;
export type CreateMediaMutationVariables = {
    data: BodyType<MediaInput>;
};
/**
* @summary Add an uploaded image or video to the media library
*/
export declare const useCreateMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedia>>, TError, CreateMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMedia>>, TError, CreateMediaMutationVariables, TContext>;
export declare const getUpdateMediaUrl: (id: number) => string;
/**
 * @summary Update media metadata and visibility
 */
export declare const updateMedia: (id: number, mediaUpdate: MediaUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<MediaItem>;
export declare const getUpdateMediaMutationKey: () => readonly ["updateMedia"];
export declare const getUpdateMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, UpdateMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, UpdateMediaMutationVariables, TContext>;
export type UpdateMediaMutationResult = NonNullable<Awaited<ReturnType<typeof updateMedia>>>;
export type UpdateMediaMutationBody = BodyType<MediaUpdate>;
export type UpdateMediaMutationError = ErrorType<unknown>;
export type UpdateMediaMutationVariables = {
    id: number;
    data: BodyType<MediaUpdate>;
};
/**
* @summary Update media metadata and visibility
*/
export declare const useUpdateMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedia>>, TError, UpdateMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMedia>>, TError, UpdateMediaMutationVariables, TContext>;
export declare const getDeleteMediaUrl: (id: number) => string;
/**
 * @summary Remove media from the library
 */
export declare const deleteMedia: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteMediaMutationKey: () => readonly ["deleteMedia"];
export declare const getDeleteMediaMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, DeleteMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, DeleteMediaMutationVariables, TContext>;
export type DeleteMediaMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMedia>>>;
export type DeleteMediaMutationError = ErrorType<unknown>;
export type DeleteMediaMutationVariables = {
    id: number;
};
/**
* @summary Remove media from the library
*/
export declare const useDeleteMedia: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedia>>, TError, DeleteMediaMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMedia>>, TError, DeleteMediaMutationVariables, TContext>;
export declare const getRequestUploadUrlUrl: () => string;
/**
 * @summary Request a presigned URL for a media upload
 */
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: Parameters<typeof customFetch>[1]) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationKey: () => readonly ["requestUploadUrl"];
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
export type RequestUploadUrlMutationVariables = {
    data: BodyType<UploadUrlRequest>;
};
/**
* @summary Request a presigned URL for a media upload
*/
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map