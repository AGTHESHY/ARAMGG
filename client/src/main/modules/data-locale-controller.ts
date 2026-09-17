type PreparedDataLocale = {
  locale: string
  dataVersion: string
}

type DataLocaleChangeDependencies = {
  prepare: (locale: string) => Promise<PreparedDataLocale>
  persist: (locale: string) => void
  activate: (locale: string) => void
  notify: (payload: PreparedDataLocale) => void
}

export async function changeDataLocale(
  requestedLocale: string,
  dependencies: DataLocaleChangeDependencies
): Promise<PreparedDataLocale> {
  const prepared = await dependencies.prepare(requestedLocale)
  if (prepared.locale !== requestedLocale) {
    throw new Error(
      `Requested data locale ${requestedLocale} is unavailable; effective locale is ${prepared.locale}`
    )
  }

  dependencies.persist(prepared.locale)
  dependencies.activate(prepared.locale)
  dependencies.notify(prepared)
  return prepared
}
