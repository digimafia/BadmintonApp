import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { useFixtureStore } from '@/features/fixtures/store/fixtureStore'
import { AppIcon } from '@/components/mobile/MobileAppShell'

const formatTournamentDate = (date: string) => {
  const value = new Date(`${date}T00:00:00`)
  if (Number.isNaN(value.getTime())) return date

  return value.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

const formatMatchTime = (time: string | null) => {
  if (!time) return 'Time TBA'

  const date = new Date(time)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return time
}

const PlayerDashboard = () => {
  const user = useAuthStore(state => state.user)
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()
  const tournaments = useTournamentStore(state => state.tournaments)
  const registrations = useRegistrationStore(state => state.registrations)
  const fixtures = useFixtureStore(state => state.fixtures)

  const userRegistrations = useMemo(
    () => registrations.filter(
      registration => registration.playerId === profile?.id && registration.status === 'REGISTERED'
    ),
    [registrations, profile]
  )

  const availableTournaments = useMemo(
    () => tournaments
      .filter(tournament => tournament.status === 'PUBLISHED')
      .filter(tournament => tournament.categories.some(category =>
        category.registrationPhase === 'OPEN' &&
        !registrations.some(registration =>
          registration.tournamentId === tournament.id &&
          registration.categoryId === category.id &&
          registration.playerId === profile?.id &&
          registration.status === 'REGISTERED'
        )
      )),
    [tournaments, registrations, profile]
  )

  const participantIds = useMemo(() => {
    const ids = [
      profile?.id,
      ...userRegistrations.map(registration => registration.teamId),
    ].filter((id): id is string => Boolean(id))

    return new Set(ids)
  }, [profile, userRegistrations])

  const playerMatches = useMemo(
    () => fixtures
      .filter(fixture => fixture.status === 'PUBLISHED')
      .flatMap(fixture => fixture.matches
        .filter(match => {
          const participant1Match = match.participant1 && participantIds.has(match.participant1.id)
          const participant2Match = match.participant2 && participantIds.has(match.participant2.id)

          return (
            (match.status === 'LIVE' || match.status === 'SCHEDULED') &&
            (participant1Match || participant2Match)
          )
        })
        .map(match => ({ fixture, match }))
      ),
    [fixtures, participantIds]
  )

  const nextMatch =
    playerMatches.find(item => item.match.status === 'LIVE') ??
    playerMatches.find(item => item.match.status === 'SCHEDULED') ??
    null

  const nextMatchTournament = nextMatch
    ? tournaments.find(tournament => tournament.id === nextMatch.fixture.tournamentId)
    : null

  const initials = profile?.fullName
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'SP'

  const firstName =
    profile?.fullName?.split(' ')[0] ||
    user?.displayName?.split(' ')[0] ||
    'Player'

  if (!user) return <div className="p-6 text-center">Please log in</div>

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6 pt-5">
      <section className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">Good to see you</p>
          <h1 className="mt-0.5 truncate text-[24px] font-black tracking-tight text-slate-950">
            Hi, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">Ready for your next match?</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/player/profile')}
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-sm font-black text-emerald-800 ring-4 ring-white shadow-sm"
          aria-label="Open profile"
        >
          {profile?.profilePhoto ? (
            <img src={profile.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
          ) : initials}
        </button>
      </section>

      {!hasProfile && (
        <button
          type="button"
          onClick={() => navigate('/player/profile')}
          className="mb-5 flex w-full items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"
        >
          <div>
            <p className="text-sm font-bold text-amber-950">Complete your player profile</p>
            <p className="mt-1 text-xs text-amber-700">Finish your profile before registering for tournaments.</p>
          </div>
          <span className="text-xl text-amber-700">›</span>
        </button>
      )}

      <section
        className="relative overflow-hidden rounded-[26px] bg-slate-950 p-5 text-white shadow-xl"
        style={{
          backgroundImage: 'radial-gradient(circle at 95% 5%, rgba(16,185,129,.48), transparent 11rem), linear-gradient(135deg,#071c2c,#0b3b34)',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
              {nextMatch?.match.status === 'LIVE' ? '● Live Match' : 'Next Match'}
            </span>
            {nextMatch && <span className="text-xs font-medium text-slate-300">{nextMatch.match.roundName}</span>}
          </div>

          {nextMatch ? (
            <>
              <p className="mt-5 text-xs font-semibold text-emerald-300">
                {nextMatchTournament?.name || nextMatch.fixture.tournamentCode}
              </p>
              <h2 className="mt-1 text-xl font-black">{nextMatch.fixture.categoryName}</h2>

              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="min-w-0 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10 text-sm font-black">
                    {nextMatch.match.participant1?.name?.slice(0, 2).toUpperCase() || '?'}
                  </div>
                  <p className="mt-2 truncate text-sm font-bold">{nextMatch.match.participant1?.name || 'TBA'}</p>
                </div>

                <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-black text-emerald-200">VS</div>

                <div className="min-w-0 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10 text-sm font-black">
                    {nextMatch.match.participant2?.name?.slice(0, 2).toUpperCase() || '?'}
                  </div>
                  <p className="mt-2 truncate text-sm font-bold">{nextMatch.match.participant2?.name || 'TBA'}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Time</p>
                  <p className="mt-0.5 text-sm font-bold">{formatMatchTime(nextMatch.match.scheduledTime)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Court</p>
                  <p className="mt-0.5 text-sm font-bold">
                    {nextMatch.match.courtNumber ? `Court ${nextMatch.match.courtNumber}` : 'TBA'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/player/fixtures')}
                className="mt-4 min-h-12 w-full rounded-2xl bg-emerald-500 px-4 text-sm font-black text-white transition active:scale-[0.98]"
              >
                View Match
              </button>
            </>
          ) : (
            <div className="py-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                <AppIcon name="bracket" />
              </div>
              <h2 className="mt-4 text-xl font-black">No upcoming matches</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                Join an open tournament and your fixtures will appear here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/player/tournaments')}
                className="mt-5 min-h-11 rounded-xl bg-white px-5 text-sm font-black text-slate-950"
              >
                Explore Tournaments
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-black tracking-tight text-slate-950">Quick actions</h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Find', icon: 'trophy' as const, path: '/player/tournaments' },
            { label: 'Entries', icon: 'clipboard' as const, path: '/player/registrations' },
            { label: 'Fixtures', icon: 'bracket' as const, path: '/player/fixtures' },
            { label: 'Profile', icon: 'user' as const, path: '/player/profile' },
          ].map(action => (
            <button
              key={action.path}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex min-h-[88px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-2 text-center shadow-sm transition active:scale-[0.97]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <AppIcon name={action.icon} />
              </span>
              <span className="mt-2 text-[11px] font-bold text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Discover</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Tournaments for you</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/player/tournaments')}
            className="min-h-10 px-2 text-sm font-bold text-emerald-700"
          >
            See all
          </button>
        </div>

        {availableTournaments.length > 0 ? (
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {availableTournaments.slice(0, 5).map(tournament => (
              <button
                key={tournament.id}
                type="button"
                onClick={() => navigate(`/player/tournaments/${tournament.id}`)}
                className="min-w-[82%] snap-start overflow-hidden rounded-[22px] border border-slate-200 bg-white text-left shadow-sm sm:min-w-[340px]"
              >
                <div className="relative h-24 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-4 text-white">
                  <div className="absolute -right-6 -top-10 h-28 w-28 rounded-full border border-white/20" />
                  <div className="relative z-10 flex items-start justify-between">
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">Registration Open</span>
                    <span className="text-xs font-bold">{formatTournamentDate(tournament.tournamentDate)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-black text-slate-950">{tournament.name}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{tournament.venueName}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tournament.categories.slice(0, 3).map(category => (
                      <span
                        key={category.id}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-500">{tournament.categories.length} categories</span>
                    <span className="text-sm font-black text-emerald-700">View tournament →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <AppIcon name="trophy" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">No open tournaments right now</p>
            <p className="mt-1 text-xs text-slate-500">New published tournaments will appear here.</p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">My activity</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">My registrations</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/player/registrations')}
            className="min-h-10 px-2 text-sm font-bold text-emerald-700"
          >
            View all
          </button>
        </div>

        {userRegistrations.length > 0 ? (
          <div className="space-y-3">
            {userRegistrations.slice(0, 2).map(registration => {
              const tournament = tournaments.find(item => item.id === registration.tournamentId)

              return (
                <button
                  key={registration.id}
                  type="button"
                  onClick={() => navigate('/player/registrations')}
                  className="flex w-full items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-4 text-left shadow-sm"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <AppIcon name={registration.eventType === 'DOUBLES' ? 'user' : 'trophy'} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">Confirmed</span>
                      <span className="truncate text-[10px] font-bold text-slate-400">{registration.registrationCode}</span>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-black text-slate-950">
                      {tournament?.name || registration.tournamentCode}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {registration.categoryName}
                      {registration.partnerName ? ` · Partner: ${registration.partnerName}` : ''}
                    </p>
                  </div>

                  <span className="text-2xl font-light text-slate-300">›</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-white px-5 py-7 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <AppIcon name="clipboard" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">No registrations yet</p>
            <button
              type="button"
              onClick={() => navigate('/player/tournaments')}
              className="mt-3 text-sm font-black text-emerald-700"
            >
              Find a tournament
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default PlayerDashboard
