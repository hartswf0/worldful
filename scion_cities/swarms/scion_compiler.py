#!/usr/bin/env python3
"""
Scion Swarm Builder — Morphogenetic Meta-Compiler for Bespoke City Swarms.

Every city is its own handmade agent swarm.
This module compiles CityGenomeSpec seeds (both the 55 canonical Invisible Cities
and newly forged or hybridized Scion Cities) into live, concurrent, lockless
CityAgentSwarm runtimes with 11 distinct algorithmic swarm physics engines.
"""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
import math
import re
from typing import Any, Callable, Dict, List, Optional, Sequence, Set, Tuple

from scion_cities.core.accumulator import (
    EmptySubstrateError,
    LocusState,
    MicroCommit,
    PhilogynyAccumulator,
    TrudeConvergenceError,
    canonical_hash,
    quarantine_untrusted_text,
)
from scion_cities.swarms.catalog_55 import (
    AgentBlueprint,
    CITIES_55,
    CityGenomeSpec,
    SERIES_TO_TOPOLOGY,
    catalog_by_name,
)

FORBIDDEN_GENERIC_ROLES: Set[str] = {
    "planner", "architect", "coder", "reviewer", "qa", "tester", "manager",
    "worker", "agent", "agent1", "agent_1", "assistant", "critic", "coordinator",
    "summarizer", "orchestrator",
}

QUINE_MUTATION_OPS: Tuple[str, ...] = (
    "invert_goal",
    "mirror_axis",
    "slow_time",
    "spawn_echo",
    "simplify_rules",
    "invert_axiom",
    "transmute_medium",
)


@dataclass(frozen=True)
class ScionAgent:
    """Autonomous material-bound worker belonging exclusively to one city's swarm."""
    name: str
    city_name: str
    topology: str
    target_locus: str
    op_kind: str
    polarity: str
    emblems: Tuple[str, ...]
    base_magnitude: float
    harmonic_ratio: Tuple[int, int]

    def step(self, tick: int, parent_hash: str, topology_mod: Dict[str, Any]) -> MicroCommit:
        """Execute one autonomous perception-action cycle against the city's topology physics."""
        phase = ((tick + 1) * self.harmonic_ratio[0]) / max(1, self.harmonic_ratio[1])
        mag = self.base_magnitude
        emblems = list(self.emblems)
        locus = self.target_locus
        op = self.op_kind
        pol = self.polarity

        # 11 distinct algorithmic physics laws shaping agent emissions per tick
        if self.topology == "PALIMPSEST_ECHO":
            # Zaira/Zora law: event-to-space ratio grows unless stasis erodes unmutated cells
            scar_ratio = round(math.sin(phase) * 1.4 + mag, 4)
            mag = max(0.5, scar_ratio)
            if topology_mod.get("stasis_ticks", 0) >= 3:
                emblems.append(f"zora_chalk_erosion_t{tick}")
            else:
                emblems.append(f"scar_ratio_{tick}:{self.harmonic_ratio[0]}_{self.harmonic_ratio[1]}")

        elif self.topology == "DESIRE_TRAP_BIFURCATION":
            # Zobeide/Fedora law: pursuit winds street-skeins tighter while spawning blue globe counter-models
            mag = round(mag + 0.65 * (tick + 1), 4)
            if tick % 2 == 1:
                emblems.append(f"blue_globe_counterfactual_t{tick}")
            else:
                emblems.append(f"sealed_pursuit_wall_t{tick}")

        elif self.topology == "SEMIOTIC_INVERSION":
            # Hypatia/Olivia law: signifier flips referent parity on odd ticks
            if tick % 2 == 1 and op == "polarity_carve":
                mag = round(11.0 - min(10.0, mag), 4)
                emblems.append(f"inverted_referent_t{tick}")

        elif self.topology == "TENSILE_VOID_RIG":
            # Isaura/Armilla/Octavia law: upward hydraulic lift vs downward catenary rope decay
            rupture_budget = max(0.2, 1.0 - 0.08 * tick)
            mag = round(mag * (1.0 + 0.25 * rupture_budget), 4)
            emblems.append(f"tensile_span_{int(rupture_budget * 100)}pct")

        elif self.topology == "CHORD_EXCHANGE_WEB":
            # Ersilia/Euphemia law: accumulate chord density; when choked, dismantle walls & migrate locus
            chord_density = topology_mod.get("chord_density", 0) + tick
            if chord_density >= 2:
                emblems.append("walls_dismantled_bare_strings_remain")
                op = "chord_tension"
            mag = round(mag + 0.5 * chord_density, 4)

        elif self.topology == "SPECULAR_PARALLAX":
            # Valdrada/Moriana/Baucis law: strict point-by-point asymmetry across mirror plane
            parity = -1.0 if (tick + len(self.name)) % 2 == 1 else 1.0
            mag = round(abs(mag + parity * 1.37), 4)
            emblems.append(f"asymmetric_parallax_{'inverted' if parity < 0 else 'erect'}_t{tick}")

        elif self.topology == "ONOMASTIC_SHARD_SHUFFLE":
            # Clarice/Leandra/Pyrrha law: cyclic permutation of surviving shards across loci
            all_loci: Tuple[str, ...] = topology_mod.get("loci", (self.target_locus,))
            locus = all_loci[(all_loci.index(self.target_locus) + tick) % len(all_loci)] if self.target_locus in all_loci else self.target_locus
            emblems.append(f"repurposed_shard_at_{locus}")

        elif self.topology == "NECROPOLIS_ROLE_CASCADE":
            # Melania/Eusapia/Laudomia law: mortal instance expires, role mask cascades forward
            incarnation = tick + 1
            emblems.append(f"role_mask_incarnation_{incarnation}")
            mag = round(mag + 0.42 * incarnation, 4)

        elif self.topology == "CELESTIAL_BLUEPRINT_COUPLING":
            # Andria/Thekla/Perinthia law: every terrestrial edit perturbs a stellar orbital coordinate
            nova_shift = round((self.harmonic_ratio[0] / self.harmonic_ratio[1]) * (tick + 1), 3)
            emblems.append(f"stellar_reciprocal_shift_{nova_shift}")
            mag = round(mag + nova_shift * 0.5, 4)

        elif self.topology == "PERIMETER_ACCRETION_SPRAWL":
            # Leonia/Procopia/Penthesilea law: inner expulsion welds outer perimeter rampart strata
            strata_height = round(mag * (1.18 ** (tick + 1)), 4)
            mag = strata_height
            emblems.append(f"perimeter_stratum_ring_{tick}")

        elif self.topology == "NESTED_GERM_EMERGENCE":
            # Berenice/Olinda/Raissa/Marozia/Theodora law: simultaneous 4-sheath inner germination
            sheath_depth = (tick % 4) + 1
            emblems.append(f"nested_sheath_depth_{sheath_depth}_active_now")
            mag = round(mag + sheath_depth * 0.73, 4)

        return MicroCommit(
            agent_name=self.name,
            locus=locus,
            op_kind=op,
            polarity=pol,
            emblems=tuple(sorted(set(emblems))),
            magnitude=mag,
            parent_hash=parent_hash,
        )


@dataclass
class CityAgentSwarm:
    """
    Self-contained, bespoke multi-agent swarm dedicated to building ONE city.
    Owns its own ScionAgents, its own PhilogynyAccumulator graph, and its own optical/sonic signature.
    """
    spec: CityGenomeSpec
    agents: Tuple[ScionAgent, ...]
    accumulator: PhilogynyAccumulator
    parent_lineage: Tuple[str, ...] = ()
    applied_mutations: Tuple[str, ...] = ()
    ticks_executed: int = 0

    def execute_ticks(self, ticks: int = 3) -> Dict[str, Any]:
        """Run the bespoke swarm autonomously across `ticks` optimistic lockless rounds."""
        last_summary: Dict[str, Any] = {}
        for t in range(ticks):
            step_idx = self.ticks_executed + t
            # Pick highest-tension active head as optimistic parent
            head_hash = max(
                self.accumulator.active_heads,
                key=lambda h: (self.accumulator.states_by_hash[h].tension_score(), h),
            )
            topo_mod = {
                "loci": self.spec.loci,
                "chord_density": step_idx,
                "stasis_ticks": 0,
            }
            commits = [ag.step(step_idx, head_hash, topo_mod) for ag in self.agents]
            last_summary = self.accumulator.accumulate_batch(head_hash, commits)
        self.ticks_executed += ticks
        peak = self.accumulator.peak_checkpoint()
        return {
            "city": self.spec.name,
            "chapter": self.spec.chapter,
            "series": self.spec.series,
            "topology": self.spec.topology,
            "agents": [a.name for a in self.agents],
            "ticks_executed": self.ticks_executed,
            "active_branch_count": last_summary.get("branch_count", 1),
            "conflict_grains_minted": len(peak.state.conflict_grains),
            "arch_scars": sorted({g.scar_emblem for g in peak.state.conflict_grains.values()}),
            "peak_checkpoint_id": peak.checkpoint_id,
            "peak_state_hash": peak.state.state_hash,
            "peak_tension": peak.tension,
            "optical_rule": self.spec.optical_rule,
            "harmonics": [f"{a.harmonic_ratio[0]}:{a.harmonic_ratio[1]}" for a in self.agents],
        }

    def run_100x_contention_storm(self, multiplier: int = 100, workers: int = 8) -> Dict[str, Any]:
        """
        Change Test 1 (CT1): Hammer this city's lockless accumulator with `multiplier * len(agents)`
        concurrent contended micro-commits generated in parallel across threads.
        Verifies zero deadlocks, zero lost commits, and exact replay determinism.
        """
        base_hash = self.accumulator.genesis_hash
        topo_mod = {"loci": self.spec.loci, "chord_density": 3, "stasis_ticks": 0}

        def _emit_burst(burst_id: int) -> List[MicroCommit]:
            out: List[MicroCommit] = []
            for ag in self.agents:
                c = ag.step(burst_id % 7, base_hash, topo_mod)
                # Tag burst micro-variation while preserving non-commuting locus collisions
                out.append(
                    MicroCommit(
                        agent_name=c.agent_name,
                        locus=c.locus,
                        op_kind=c.op_kind,
                        polarity=c.polarity,
                        emblems=c.emblems + (f"burst_{burst_id:03d}",),
                        magnitude=round(c.magnitude + (burst_id % 5) * 0.11, 4),
                        parent_hash=base_hash,
                    )
                )
            return out

        all_commits: List[MicroCommit] = []
        batches: List[List[MicroCommit]] = []
        acc_concurrent = PhilogynyAccumulator(self.spec.name, velocity_clamp=max(20_000, multiplier * len(self.agents) * 2))

        def _emit_and_commit(burst_id: int) -> List[MicroCommit]:
            batch = _emit_burst(burst_id)
            acc_concurrent.accumulate_batch(base_hash, batch)
            return batch

        with ThreadPoolExecutor(max_workers=workers) as pool:
            for batch in pool.map(_emit_and_commit, range(multiplier)):
                batches.append(batch)
                all_commits.extend(batch)

        assert acc_concurrent.ops_submitted == len(all_commits), (
            f"Lost ops under concurrent accumulate_batch: {acc_concurrent.ops_submitted} != {len(all_commits)}"
        )

        # Accumulate forward vs reversed arrival order on two independent accumulators to prove CD1/CD2
        acc_forward = PhilogynyAccumulator(self.spec.name, velocity_clamp=max(20_000, len(all_commits) * 2))
        acc_reverse = PhilogynyAccumulator(self.spec.name, velocity_clamp=max(20_000, len(all_commits) * 2))

        res_fwd = acc_forward.accumulate_batch(acc_forward.genesis_hash, all_commits)
        res_rev = acc_reverse.accumulate_batch(acc_reverse.genesis_hash, list(reversed(all_commits)))

        assert res_fwd["canonical_fork_set_hash"] == res_rev["canonical_fork_set_hash"], (
            "Order-independence violated under 100x contention!"
        )
        return {
            "city": self.spec.name,
            "total_contended_commits": len(all_commits),
            "concurrent_ops_recorded": acc_concurrent.ops_submitted,
            "concurrent_active_heads": len(acc_concurrent.active_heads),
            "forward_fork_hash": res_fwd["canonical_fork_set_hash"],
            "reverse_fork_hash": res_rev["canonical_fork_set_hash"],
            "order_independent_verified": True,
            "grains_minted": len(res_fwd["grains_minted"]),
            "branch_count": res_fwd["branch_count"],
        }


class ScionSwarmBuilder:
    """
    Meta-Morphogenetic Builder that handcrafts a unique Agent Swarm per city.
    - Compiles all 55 canonical Invisible Cities with verified zero role/emblem overlap.
    - Forges new bespoke Scion Cities from raw emblem seeds, Quine rule-mutations, or dual-city hybrids.
    - Enforces Anti-Trude Monoculture & Kublai Norm-Collapse circuit breakers.
    """

    def __init__(self, strictness: float = 0.85) -> None:
        self.strictness = strictness
        self.registered_agent_names: Set[str] = set()
        self.swarms: Dict[str, CityAgentSwarm] = {}

    def _validate_anti_trude(self, spec: CityGenomeSpec, check_global_disjointness: bool = True) -> None:
        quarantine_untrusted_text(spec.name)
        if len(spec.agents) < 3:
            raise TrudeConvergenceError(f"{spec.name}: Swarm requires >=3 bespoke agents to form an arch.")

        magnitudes = [a.base_magnitude for a in spec.agents]
        mean_m = sum(magnitudes) / len(magnitudes)
        variance = sum((m - mean_m) ** 2 for m in magnitudes) / len(magnitudes)
        polarities = {a.polarity for a in spec.agents}

        if len(polarities) < 2 or variance < 0.15:
            raise TrudeConvergenceError(
                f"TRUDE_MONOCULTURE_BLOCKED ({spec.name}): uniform polarity or flat magnitude variance "
                f"(var={variance:.4f}, polarities={polarities}). Kublai chessboard washout rejected."
            )

        for ag in spec.agents:
            tokens = set(re.split(r"[_\-\s]+", ag.name.lower()))
            if ag.name.lower() in FORBIDDEN_GENERIC_ROLES or (tokens & FORBIDDEN_GENERIC_ROLES):
                raise TrudeConvergenceError(
                    f"GENERIC_COW_PATH_ROLE_BLOCKED ({spec.name}): agent '{ag.name}' contains forbidden generic role token."
                )
            if check_global_disjointness and ag.name in self.registered_agent_names:
                raise TrudeConvergenceError(
                    f"SWARM_CLONE_COLLISION ({spec.name}): agent '{ag.name}' already belongs to another city's swarm!"
                )

    def build_city_swarm(
        self,
        spec: CityGenomeSpec,
        lineage: Tuple[str, ...] = (),
        mutations: Tuple[str, ...] = (),
        register: bool = True,
    ) -> CityAgentSwarm:
        """Handcraft a bespoke CityAgentSwarm from a validated CityGenomeSpec."""
        self._validate_anti_trude(spec, check_global_disjointness=register)
        agents = tuple(
            ScionAgent(
                name=bp.name,
                city_name=spec.name,
                topology=spec.topology,
                target_locus=bp.locus,
                op_kind=bp.op_kind,
                polarity=bp.polarity,
                emblems=bp.emblems,
                base_magnitude=bp.base_magnitude,
                harmonic_ratio=bp.harmonic_ratio,
            )
            for bp in spec.agents
        )
        acc = PhilogynyAccumulator(city_name=spec.name, strictness=self.strictness)
        swarm = CityAgentSwarm(
            spec=spec,
            agents=agents,
            accumulator=acc,
            parent_lineage=lineage,
            applied_mutations=mutations,
        )
        if register:
            for ag in agents:
                self.registered_agent_names.add(ag.name)
            self.swarms[spec.name.lower()] = swarm
        return swarm

    def build_all_55_canonical(self, initial_ticks: int = 3) -> Dict[str, CityAgentSwarm]:
        """Instantiate and execute all 55 bespoke Invisible Cities swarms."""
        for spec in CITIES_55:
            sw = self.build_city_swarm(spec, lineage=("Calvino_1972_Weaver_1974",), register=True)
            if initial_ticks > 0:
                sw.execute_ticks(initial_ticks)
        return self.swarms

    def mutate_city_scion(
        self,
        parent_name: str,
        mutation_op: str,
        scion_name: Optional[str] = None,
    ) -> CityAgentSwarm:
        """
        Quine Re-Entry: Apply one of the 7 Rule-Mutation Operators to a parent city
        to handcraft a structurally distinct child Scion City with its own bespoke agent swarm.
        """
        if mutation_op not in QUINE_MUTATION_OPS:
            raise ValueError(f"Unknown mutation_op '{mutation_op}'. Expected one of {QUINE_MUTATION_OPS}")
        base_map = catalog_by_name()
        key = parent_name.lower()
        if key not in base_map and key not in self.swarms:
            raise KeyError(f"Unknown parent city '{parent_name}'.")
        p_spec = self.swarms[key].spec if key in self.swarms else base_map[key]

        slug = re.sub(r"[^a-z0-9]+", "_", (scion_name or f"{p_spec.name}_{mutation_op}").lower()).strip("_")
        display_name = scion_name or f"{p_spec.name}-{mutation_op.replace('_', '-').title()}"

        # Mutate topology, poles, optics, and agent behaviors according to the operator
        all_topologies = list(SERIES_TO_TOPOLOGY.values())
        cur_idx = all_topologies.index(p_spec.topology)

        if mutation_op == "invert_goal":
            new_topo = p_spec.topology
            pa, pb = f"anti_{p_spec.pole_beta}", f"subverted_{p_spec.pole_alpha}"
            optics = f"Inverted-objective negative of ({p_spec.optical_rule})"
        elif mutation_op == "mirror_axis":
            new_topo = "SPECULAR_PARALLAX"
            pa, pb = f"obverse_{p_spec.pole_beta}", f"specular_{p_spec.pole_alpha}"
            optics = f"Bilateral chiral lake-fold across ({p_spec.optical_rule})"
        elif mutation_op == "slow_time":
            new_topo = "NECROPOLIS_ROLE_CASCADE"
            pa, pb = f"millennial_{p_spec.pole_alpha}", f"glacial_{p_spec.pole_beta}"
            optics = f"Long-exposure geological drift over ({p_spec.optical_rule})"
        elif mutation_op == "spawn_echo":
            new_topo = "NESTED_GERM_EMERGENCE"
            pa, pb = f"inner_seed_{p_spec.pole_alpha}", f"outer_husk_{p_spec.pole_beta}"
            optics = f"Concentric pinhead micro-echo inside ({p_spec.optical_rule})"
        elif mutation_op == "simplify_rules":
            new_topo = "TENSILE_VOID_RIG"
            pa, pb = f"bare_armature_{p_spec.pole_alpha}", f"void_stripped_{p_spec.pole_beta}"
            optics = f"Wall-stripped skeletal armature of ({p_spec.optical_rule})"
        elif mutation_op == "invert_axiom":
            new_topo = all_topologies[(cur_idx + 5) % len(all_topologies)]
            pa, pb = f"carved_absence_{p_spec.pole_beta}", f"counter_axiom_{p_spec.pole_alpha}"
            optics = f"Axiom-inverted negative relief of ({p_spec.optical_rule})"
        else:  # transmute_medium
            new_topo = "CELESTIAL_BLUEPRINT_COUPLING"
            pa, pb = f"acoustic_star_{p_spec.pole_alpha}", f"harmonic_orbit_{p_spec.pole_beta}"
            optics = f"Synesthetic frequency-to-starlight transmutation of ({p_spec.optical_rule})"

        new_loci = tuple(f"{slug}_{loc}" for loc in p_spec.loci)
        mutated_agents: List[AgentBlueprint] = []
        role_suffixes = ("carver", "inverter", "spanner", "warden")
        for idx, ag in enumerate(p_spec.agents):
            new_ag_name = f"{slug}_{mutation_op}_{role_suffixes[idx]}"
            while new_ag_name in self.registered_agent_names:
                new_ag_name = f"{new_ag_name}_x"
            flipped_pol = pa if ag.polarity == p_spec.pole_beta else pb
            new_mag = round(max(1.2, 11.5 - ag.base_magnitude + idx * 0.65), 3)
            new_harm = (ag.harmonic_ratio[1] + idx + 1, max(1, ag.harmonic_ratio[0]))
            mutated_agents.append(
                AgentBlueprint(
                    name=new_ag_name,
                    locus=new_loci[0] if idx < 2 else new_loci[min(idx - 1, len(new_loci) - 1)],
                    op_kind="polarity_carve" if idx < 2 else ag.op_kind,
                    polarity=pa if idx == 0 else (pb if idx == 1 else flipped_pol),
                    emblems=tuple(f"{mutation_op}:{e}" for e in ag.emblems),
                    base_magnitude=new_mag,
                    harmonic_ratio=new_harm,
                )
            )

        child_spec = CityGenomeSpec(
            index=len(CITIES_55) + len(self.swarms) + 1,
            name=display_name,
            chapter=p_spec.chapter,
            series=p_spec.series,
            rank=p_spec.rank,
            weaver_page=p_spec.weaver_page,
            topology=new_topo,
            desert_opposed=f"parent friction of {p_spec.name} ({p_spec.desert_opposed})",
            pole_alpha=pa,
            pole_beta=pb,
            optical_rule=optics,
            loci=new_loci,  # type: ignore[arg-type]
            agents=tuple(mutated_agents),  # type: ignore[arg-type]
        )
        child_swarm = self.build_city_swarm(
            child_spec,
            lineage=(p_spec.name,),
            mutations=(mutation_op,),
            register=True,
        )
        child_swarm.execute_ticks(3)
        return child_swarm

    def hybridize_cities(
        self,
        city_a: str,
        city_b: str,
        scion_name: str,
    ) -> CityAgentSwarm:
        """
        Atlas Mixture Law (Weaver p. 138: Troy x Constantinople -> San Francisco):
        Cross two irreducible cities so their dominant contradictions collide in a handmade hybrid swarm.
        """
        sanitized_scion, _ = quarantine_untrusted_text(scion_name)
        base_map = catalog_by_name()
        sa = self.swarms[city_a.lower()].spec if city_a.lower() in self.swarms else base_map[city_a.lower()]
        sb = self.swarms[city_b.lower()].spec if city_b.lower() in self.swarms else base_map[city_b.lower()]
        if sa.name == sb.name:
            raise TrudeConvergenceError("Hybridization requires two distinct cities to form a non-commuting arch.")

        slug = re.sub(r"[^a-z0-9]+", "_", sanitized_scion.lower()).strip("_")
        shared_nexus = f"{slug}_confluence_arch"
        loci = (shared_nexus, f"{slug}_{sa.loci[1]}", f"{slug}_{sb.loci[2]}")

        hybrid_agents = (
            AgentBlueprint(
                name=f"{slug}_{sa.name.lower()}_keel_weaver",
                locus=shared_nexus,
                op_kind="polarity_carve",
                polarity=sa.pole_alpha,
                emblems=sa.agents[0].emblems + (f"scion_from_{sa.name.lower()}",),
                base_magnitude=round(sa.agents[0].base_magnitude + 0.9, 3),
                harmonic_ratio=sa.agents[0].harmonic_ratio,
            ),
            AgentBlueprint(
                name=f"{slug}_{sb.name.lower()}_counter_spanner",
                locus=shared_nexus,
                op_kind="polarity_carve",
                polarity=sb.pole_beta,
                emblems=sb.agents[1].emblems + (f"scion_from_{sb.name.lower()}",),
                base_magnitude=round(max(1.4, sb.agents[1].base_magnitude - 1.7), 3),
                harmonic_ratio=sb.agents[1].harmonic_ratio,
            ),
            AgentBlueprint(
                name=f"{slug}_parallax_graft_mason",
                locus=loci[1],
                op_kind="emblem_union",
                polarity=sa.pole_beta,
                emblems=(sa.agents[2].emblems[0], sb.agents[2].emblems[0]),
                base_magnitude=round((sa.agents[2].base_magnitude + sb.agents[2].base_magnitude) * 0.52, 3),
                harmonic_ratio=sa.agents[2].harmonic_ratio,
            ),
            AgentBlueprint(
                name=f"{slug}_horizon_keystone_sentinel",
                locus=loci[2],
                op_kind="altitude_max",
                polarity=sb.pole_alpha,
                emblems=(sa.agents[3].emblems[-1], sb.agents[3].emblems[-1]),
                base_magnitude=round(max(sa.agents[3].base_magnitude, sb.agents[3].base_magnitude) + 1.1, 3),
                harmonic_ratio=sb.agents[3].harmonic_ratio,
            ),
        )
        hybrid_spec = CityGenomeSpec(
            index=len(CITIES_55) + len(self.swarms) + 1,
            name=sanitized_scion,
            chapter=9,
            series=f"{sa.series} x {sb.series}",
            rank=5,
            weaver_page=138,
            topology=sb.topology,
            desert_opposed=f"collision of ({sa.desert_opposed}) and ({sb.desert_opposed})",
            pole_alpha=sa.pole_alpha,
            pole_beta=sb.pole_beta,
            optical_rule=f"{sa.optical_rule} // grafted through // {sb.optical_rule}",
            loci=loci,
            agents=hybrid_agents,
        )
        sw = self.build_city_swarm(
            hybrid_spec,
            lineage=(sa.name, sb.name),
            mutations=("atlas_hybrid_graft",),
            register=True,
        )
        sw.execute_ticks(3)
        return sw

    def forge_custom_city_from_seed(
        self,
        city_name: str,
        desert_opposed: str,
        material_nouns: Sequence[str],
        pole_alpha: str,
        pole_beta: str,
        series: str = "Hidden cities",
    ) -> CityAgentSwarm:
        """
        Handcraft a brand-new Scion City Swarm directly from primary material nouns & opposing poles.
        """
        clean_city, _ = quarantine_untrusted_text(city_name)
        clean_desert, _ = quarantine_untrusted_text(desert_opposed)
        cleaned_nouns = [quarantine_untrusted_text(n)[0] for n in material_nouns if n and n.strip()]
        if len(cleaned_nouns) < 4:
            raise EmptySubstrateError("Custom Scion City requires >= 4 concrete material nouns (zero abstract filler).")

        slug = re.sub(r"[^a-z0-9]+", "_", clean_city.lower()).strip("_")
        topo = SERIES_TO_TOPOLOGY.get(series, "NESTED_GERM_EMERGENCE")
        loci = (f"{slug}_crucible_gate", f"{slug}_span_vault", f"{slug}_horizon_edge")

        def _noun_slug(s: str) -> str:
            return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:24]

        agents = (
            AgentBlueprint(
                name=f"{slug}_{_noun_slug(cleaned_nouns[0])}_forger",
                locus=loci[0],
                op_kind="polarity_carve",
                polarity=pole_alpha,
                emblems=(cleaned_nouns[0], cleaned_nouns[1]),
                base_magnitude=8.4,
                harmonic_ratio=(3, 2),
            ),
            AgentBlueprint(
                name=f"{slug}_{_noun_slug(cleaned_nouns[1])}_counterweight",
                locus=loci[0],
                op_kind="polarity_carve",
                polarity=pole_beta,
                emblems=(cleaned_nouns[1], cleaned_nouns[2]),
                base_magnitude=2.7,
                harmonic_ratio=(5, 4),
            ),
            AgentBlueprint(
                name=f"{slug}_{_noun_slug(cleaned_nouns[2])}_rigger",
                locus=loci[1],
                op_kind="emblem_union",
                polarity=pole_alpha,
                emblems=tuple(cleaned_nouns[2:]),
                base_magnitude=6.9,
                harmonic_ratio=(9, 8),
            ),
            AgentBlueprint(
                name=f"{slug}_{_noun_slug(cleaned_nouns[3])}_sentinel",
                locus=loci[2],
                op_kind="altitude_max",
                polarity=pole_beta,
                emblems=(cleaned_nouns[0], cleaned_nouns[-1]),
                base_magnitude=9.1,
                harmonic_ratio=(15, 8),
            ),
        )
        custom_spec = CityGenomeSpec(
            index=len(CITIES_55) + len(self.swarms) + 1,
            name=clean_city,
            chapter=9,
            series=series,
            rank=5,
            weaver_page=165,
            topology=topo,
            desert_opposed=clean_desert,
            pole_alpha=pole_alpha,
            pole_beta=pole_beta,
            optical_rule=f"Refracted {cleaned_nouns[0]} against {cleaned_nouns[-1]} opposing {clean_desert}",
            loci=loci,
            agents=agents,
        )
        sw = self.build_city_swarm(
            custom_spec,
            lineage=("custom_seed_forge",),
            mutations=("bespoke_synthesis",),
            register=True,
        )
        sw.execute_ticks(3)
        return sw
