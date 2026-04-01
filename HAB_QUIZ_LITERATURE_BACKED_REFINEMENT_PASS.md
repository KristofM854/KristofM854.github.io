
# HAB Quiz Literature-Backed Refinement Pass

## Purpose
This document is the working brief for updating the HAB quiz question bank with literature-backed refinements while avoiding duplicate or near-duplicate questions already present in the JSON files.

It is written for a coding agent that will update:
- `quiz-src/src/data/questions/shellfish_poisoning.json`
- `quiz-src/src/data/questions/organisms.json`
- `quiz-src/src/data/questions/toxin_chemistry.json`
- `quiz-src/src/data/questions/monitoring.json`
- `quiz-src/src/data/questions/environment.json`
- `quiz-src/src/data/questions/health_safety.json`
- `quiz-src/src/data/questions/species_id.json`

---

## How to use this file

For each category:
1. read the **existing overlap / duplicate check** section
2. do **not** add a proposed question if an existing question already covers the same learning objective
3. if a question is marked **REPLACE**, revise the existing JSON item instead of adding a new one
4. if a question is marked **ADD**, create a new item
5. preserve a balanced mix of beginner / intermediate / expert questions
6. add `references`, `sourceShort`, `learningObjective`, and `lastReviewed` fields to any updated item

---

## Source pack used for this pass

### Core regulatory / risk-assessment sources
1. EFSA 2009. *Marine biotoxins in shellfish – Saxitoxin group*. DOI: 10.2903/j.efsa.2009.1019
2. EFSA 2009. *Marine biotoxins in shellfish – Domoic acid*. DOI: 10.2903/j.efsa.2009.1181
3. EFSA 2008/2009. *Marine biotoxins in shellfish – Okadaic acid and analogues*. DOI: 10.2903/j.efsa.2008.589
4. EFSA 2008. *Marine biotoxins in shellfish – Azaspiracid group*. DOI: 10.2903/j.efsa.2008.723
5. EFSA 2009. *Marine biotoxins in shellfish – Summary on regulated marine biotoxins*. DOI: 10.2903/j.efsa.2009.1306
6. Regulation (EU) No 15/2011: EU reference method for lipophilic marine biotoxins is LC-MS/MS

### Ecology / climate / organism sources
7. Wells et al. 2015. *Harmful algal blooms and climate change: Learning from the past and present to forecast the future*. Harmful Algae 49:68–93.
8. John et al. 2014. *Formal revision of the Alexandrium tamarense species complex*. Protist 165(6):779–804. DOI: 10.1016/j.protis.2014.10.001
9. Tillmann et al. 2009. *Azadinium spinosum gen. et sp. nov. identified as a primary producer of azaspiracid toxins*. European Journal of Phycology 44(1):63–79.
10. IOC-UNESCO / HAEDAT database background
11. EFSA topic page: ciguatoxins and other marine biotoxins

### Wildlife / public-health context
12. California sea lion domoic acid literature (epilepsy, reproductive impacts)
13. WHO drinking-water guidance for microcystin-LR
14. Toledo 2014 Lake Erie microcystin crisis background

---

# Category 1 — Shellfish Poisoning Syndromes

## Existing overlap / duplicate check
Already covered in current JSON:
- PSP definition
- DSP symptom profile
- ASP memory loss
- cooking/freezing does not reliably eliminate toxins
- aerosolized NSP exposure
- PSP rapid onset
- CFP temperature reversal
- PSP highest shellfish-syndrome mortality
- AZP first identified from Irish-linked mussels
- PEI 1987 / blue mussels
- butter clam long retention
- okadaic acid tumor promoter
- Gambierdiscus origin of ciguatera
- brevetoxin site 5

Do **not** re-add those concepts.

## Recommended actions
- mostly **ADD**
- only replace vague wording where explanations are too absolute or where regulatory/public-health framing can be sharper

## Proposed additions

### SP-ADD-01
Difficulty: beginner
Learning objective: distinguish food-web vector syndromes from direct algal exposure
Question: Why are shellfish poisoning syndromes often described as food-web diseases?
Correct answer: Because the toxin is produced by microalgae but reaches humans through bioaccumulating seafood vectors.
Why add: not directly covered in current set.

### SP-ADD-02
Difficulty: intermediate
Learning objective: distinguish CFP from shellfish syndromes by vector
Question: Which poisoning syndrome is most strongly associated with large predatory reef fish rather than bivalve molluscs?
Correct answer: Ciguatera fish poisoning.
Why add: complementary framing not duplicated by the existing CFP temperature question.

### SP-ADD-03
Difficulty: intermediate
Learning objective: understand why some seafood products can be safer after tissue removal
Question: Why can toxin risk differ between whole shellfish and edible portions of some seafood products?
Correct answer: Because toxin distribution is tissue-specific and some toxins accumulate more strongly in viscera or digestive tissues than in muscle.
Why add: useful bridge to monitoring and food-safety management.

### SP-ADD-04
Difficulty: expert
Learning objective: compare sodium-channel toxin mechanisms
Question: Which statement best contrasts saxitoxins and brevetoxins at the sodium channel?
Correct answer: Saxitoxins block site 1 and prevent ion flux, whereas brevetoxins alter activation/inactivation behavior at site 5.
Why add: current bank has the site-5 fact but not the direct mechanistic comparison.

### SP-ADD-05
Difficulty: expert
Learning objective: recognize chronicity differences
Question: Which marine biotoxin syndrome is most associated with prolonged or relapsing neurological symptoms after the acute phase?
Correct answer: Ciguatera fish poisoning.
Why add: new learning objective.

### SP-ADD-06
Difficulty: intermediate
Learning objective: distinguish acute-severe from common-nonfatal syndromes
Question: Which shellfish syndrome is commonly non-fatal yet strongly associated with acute gastrointestinal symptoms?
Correct answer: DSP.
Why add: only partially covered by current DSP item.

### SP-ADD-07
Difficulty: expert
Learning objective: connect syndrome identity to receptor class
Question: Which syndrome is linked to hippocampal excitotoxic injury mediated by glutamatergic signaling?
Correct answer: ASP.
Why add: more mechanistic than existing memory-loss item.

### SP-ADD-08
Difficulty: beginner
Learning objective: separate route-of-exposure concepts
Question: Which syndrome is uniquely notable for clinically relevant inhalation exposure during bloom events?
Correct answer: NSP.
Why add: reinforces the route-of-exposure distinction.

### SP-ADD-09
Difficulty: expert
Learning objective: tie syndrome identity to policy/monitoring implications
Question: Why do long toxin-retention species complicate management after a bloom has ended?
Correct answer: Because seafood risk can persist after water-column bloom indicators decline.
Why add: generalizes beyond butter clam example.

### SP-ADD-10
Difficulty: intermediate
Learning objective: understand prevention principle
Question: Why are harvest closures more effective than consumer-side preparation methods for preventing shellfish poisoning?
Correct answer: Because marine biotoxins are often heat-stable, not detectable by consumers, and must be controlled before product reaches the plate.
Why add: useful synthesis item.

---

# Category 2 — Causative Organisms

## Existing overlap / duplicate check
Already covered:
- Alexandrium as key PSP genus
- Pseudo-nitzschia as domoic-acid diatom
- cyanobacteria as blue-green “algae”
- red tide terminology
- Dinophysis for DSP
- resting cysts
- Pseudo-nitzschia pennate stepped chains
- microcystins in cyanobacteria
- Dinophysis mixotrophy
- Karenia brevis and brevetoxins
- Alexandrium tamarense species-complex revision (flagged)
- Azadinium spinosum order placement (flagged)
- cyanobacteria vs dinoflagellate prokaryote/eukaryote contrast
- stress-enhanced domoic acid production

Do **not** re-add those concepts.

## Recommended actions
- **REPLACE** the two flagged expert questions with tighter wording and citations
- otherwise **ADD** missing ecological-identification concepts

## Proposed replacements

### ORG-REPLACE-01
Replace current `org-e-001`
Reason: present explanation oversimplifies the taxonomy as “five species based on ribotype clades” without naming the revised species clearly.
Revised concept:
Question: Following the molecular revision of the Alexandrium tamarense species complex, what did the study conclude about the traditional morphospecies A. tamarense, A. fundyense, and A. catenella?
Correct answer: They did not map reliably onto the genetic groups, which were resolved as five distinct species.
Reference: John et al. 2014.

### ORG-REPLACE-02
Replace current `org-e-002`
Reason: order placement wording should be checked and sourced tightly to Tillmann et al. / accepted taxonomy.
Revised concept:
Question: Azadinium spinosum was identified as a primary producer of azaspiracids in 2009. Why was this organism overlooked for so long in field monitoring?
Correct answer: It is a very small dinoflagellate that is easy to miss in routine microscopy counts.
Reference: Tillmann et al. 2009.
This is more pedagogically useful and less taxonomy-fragile.

## Proposed additions

### ORG-ADD-01
Difficulty: beginner
Learning objective: identify toxin family by producer group
Question: Which major shellfish-toxin syndrome is caused by diatoms rather than dinoflagellates?
Correct answer: ASP.
Why add: not duplicate of Pseudo-nitzschia item because this teaches producer-group contrast.

### ORG-ADD-02
Difficulty: intermediate
Learning objective: identify benthic HAB relevance
Question: Which genus is most strongly associated with ciguatera risk in tropical benthic habitats?
Correct answer: Gambierdiscus.
Why add: currently only present indirectly in shellfish_poisoning.

### ORG-ADD-03
Difficulty: intermediate
Learning objective: ecological distinction
Question: What best distinguishes benthic epiphytic HAB taxa from planktonic bloom-formers?
Correct answer: Benthic epiphytes grow attached to substrates/macrophytes, whereas planktonic taxa remain suspended in the water column.
Why add: fills major ecology gap.

### ORG-ADD-04
Difficulty: intermediate
Learning objective: species-level ID challenge
Question: Why is species-level identification within Pseudo-nitzschia often difficult by light microscopy alone?
Correct answer: Many species are morphologically similar and may require EM or molecular tools.
Why add: useful for future species-ID category.

### ORG-ADD-05
Difficulty: intermediate
Learning objective: why species-level resolution matters
Question: Why is species-level identification important within Alexandrium?
Correct answer: Toxicity, distribution, and bloom behavior differ across species and complexes.
Why add: not currently explicit.

### ORG-ADD-06
Difficulty: expert
Learning objective: mixotrophy significance
Question: Why is mixotrophy important in HAB ecology?
Correct answer: It can allow taxa to persist and bloom under conditions that do not favor purely autotrophic growth.
Why add: broader concept beyond Dinophysis.

### ORG-ADD-07
Difficulty: expert
Learning objective: food-web transfer ecology
Question: Why are Gambierdiscus and Fukuyoa especially relevant to reef-fish poisoning risk?
Correct answer: They live on benthic substrates grazed by herbivores, allowing toxins to enter reef food webs and biomagnify.
Why add: literature-backed and not currently in organisms.json.

### ORG-ADD-08
Difficulty: expert
Learning objective: cyst ecology
Question: Why do resting-cyst seed beds matter for bloom recurrence?
Correct answer: They can reseed future blooms even after the water column appears clear.
Why add: related to existing cyst item, but framed for management/prediction; keep only if not too close in duplicate scan.

### ORG-ADD-09
Difficulty: intermediate
Learning objective: compare Dinophysis and Prorocentrum relevance
Question: Which genus is the principal pelagic shellfish-contamination concern for OA-group toxins in many monitoring programmes?
Correct answer: Dinophysis.
Why add: clarifies Dinophysis vs benthic Prorocentrum.

### ORG-ADD-10
Difficulty: beginner
Learning objective: reinforce taxonomic breadth of HABs
Question: Why does a broad HAB curriculum include cyanobacteria even when many classical shellfish toxins are marine?
Correct answer: Because harmful blooms and toxin risk also occur in fresh and transitional waters.
Why add: bridges marine and freshwater content.

---

# Category 3 — Biotoxin Chemistry

## Existing overlap / duplicate check
Already covered:
- saxitoxin as PSP toxin
- okadaic acid sponge-discovery history
- domoic acid as glutamate analogue
- brevetoxin → NSP pairing
- STX site 1
- OA PP1/PP2A
- PSP family >50 analogues
- domoic acid receptor agonism
- TTX and STX site 1
- acid hydrolysis of C-toxins
- brevetoxin/ciguatoxin ladder polyethers
- YTX not sharing OA phosphatase mechanism
- domoic acid isomer potency

Do **not** re-add those.

## Recommended actions
Mostly **ADD** around analogue profiles, masked forms, and structure–activity.

## Proposed additions

### TC-ADD-01
Difficulty: intermediate
Learning objective: understand why analogue profiles matter
Question: Why is total toxin mass alone often insufficient for hazard assessment within a toxin family?
Correct answer: Because different analogues can differ markedly in potency.
Why add: current bank mentions analogues but not the hazard-assessment principle directly.

### TC-ADD-02
Difficulty: expert
Learning objective: masked/esterified toxin concept
Question: Why are esterified OA-group toxins important in shellfish analysis?
Correct answer: They can be hydrolyzed to free toxins and affect the apparent total toxic burden.
Why add: high-value analytical chemistry concept absent.

### TC-ADD-03
Difficulty: intermediate
Learning objective: compare mechanism classes
Question: Which toxin group is most classically associated with protein phosphatase inhibition?
Correct answer: OA/DTX group.
Why add: simpler reinforcement item useful for study mode.

### TC-ADD-04
Difficulty: expert
Learning objective: connect structure–activity with analytical design
Question: Why is structure–activity knowledge important when designing antibody- or receptor-based assays?
Correct answer: Because small structural changes can alter cross-reactivity or receptor affinity.
Why add: links chemistry to monitoring.

### TC-ADD-05
Difficulty: expert
Learning objective: compare sodium-channel toxins
Question: Which two toxin families share sodium-channel targeting but differ in whether they block versus activate/modify the channel?
Correct answer: Saxitoxins and brevetoxins.
Why add: useful synthesis, distinct from pure mechanism recall.

### TC-ADD-06
Difficulty: intermediate
Learning objective: parent compound vs metabolite thinking
Question: Why can shellfish biotransformation complicate toxin interpretation?
Correct answer: Parent toxins may be converted into metabolites or derivatives that change measured profiles and toxicity assessment.
Why add: absent from current chemistry set.

### TC-ADD-07
Difficulty: expert
Learning objective: regulation/chemistry mismatch
Question: Why are some lipophilic marine biotoxins grouped together analytically even though their mechanisms differ?
Correct answer: Because they may co-extract and be addressed in shared analytical/regulatory workflows despite toxicological differences.
Why add: extends current YTX item into a general concept.

### TC-ADD-08
Difficulty: beginner
Learning objective: receptor-family contrast
Question: Which toxin is most directly linked to glutamatergic excitotoxicity rather than sodium-channel disruption or phosphatase inhibition?
Correct answer: Domoic acid.
Why add: keep only if duplicate scan says it is distinct enough from current receptor item.

### TC-ADD-09
Difficulty: intermediate
Learning objective: toxicity-equivalence logic
Question: Why are TEFs essential when converting analogue-specific concentrations into a single STX-equivalent value?
Correct answer: Because each analogue contributes different relative toxicity.
Why add: partly present in monitoring, but useful cross-category support.

### TC-ADD-10
Difficulty: expert
Learning objective: toxin-family diversity
Question: Which statement best describes the OA-group, PSP-group, and DA-group with respect to chemical diversity?
Correct answer: OA- and PSP-groups contain multiple analogues, whereas domoic acid has fewer closely related isomeric forms of principal toxic relevance.
Why add: broad chemistry synthesis item.

---

# Category 4 — Monitoring & Detection

## Existing overlap / duplicate check
Already covered:
- purpose of shellfish monitoring
- mouse bioassay
- satellite ocean color
- mussels as sentinel species
- PSP 800 µg STX eq./kg
- DA 20 mg/kg
- ELISA
- RBA using rat brain sodium channels
- HPLC-FLD oxidation for PSP
- LC-MS/MS as EU lipophilic reference method
- AOAC 2011.27 RBA
- TEFs
- HAEDAT

Do **not** re-add those.

## Recommended actions
This category should emphasize **screening vs confirmatory logic**, matrix effects, fit-for-purpose methods, and data-interpretation concepts.

## Proposed additions

### MON-ADD-01
Difficulty: beginner
Learning objective: screening vs confirmatory distinction
Question: What is the main difference between a screening method and a confirmatory method in HAB toxin monitoring?
Correct answer: Screening methods rapidly triage samples, while confirmatory methods provide more specific identification and defensible quantification.
Why add: major gap.

### MON-ADD-02
Difficulty: intermediate
Learning objective: functional vs structural assays
Question: What is a major strength of receptor binding assays compared with purely structural detection methods?
Correct answer: They reflect biological activity of the toxin mixture at the target receptor.
Why add: not explicitly covered.

### MON-ADD-03
Difficulty: intermediate
Learning objective: ELISA limitation
Question: What is a major limitation of immunoassays such as ELISA for marine toxin analysis?
Correct answer: Cross-reactivity and variable analogue recognition can bias interpretation.
Why add: complements existing ELISA question.

### MON-ADD-04
Difficulty: expert
Learning objective: matrix effects
Question: Why are matrix effects important in LC-MS/MS analysis of shellfish toxins?
Correct answer: Ion suppression or enhancement from the sample matrix can bias quantification.
Why add: absent and highly relevant.

### MON-ADD-05
Difficulty: expert
Learning objective: reference materials
Question: Why are certified or fit-for-purpose reference materials important in HAB toxin monitoring?
Correct answer: They improve calibration, comparability, and quality control across laboratories.
Why add: directly aligned with your training interests.

### MON-ADD-06
Difficulty: intermediate
Learning objective: phytoplankton vs shellfish data
Question: Why is phytoplankton abundance alone not sufficient to assess seafood safety?
Correct answer: Cell presence does not always predict toxin burden in seafood vectors.
Why add: crucial monitoring principle.

### MON-ADD-07
Difficulty: expert
Learning objective: interlaboratory exercises
Question: Why are interlaboratory comparison exercises important in marine biotoxin analysis?
Correct answer: They assess reproducibility, comparability, and method-transfer performance across labs.
Why add: absent.

### MON-ADD-08
Difficulty: intermediate
Learning objective: fit-for-purpose workflow
Question: In a resource-constrained monitoring programme, why might a screening-plus-confirmation workflow be preferable to using LC-MS/MS on every sample?
Correct answer: It balances speed, cost, and analytical specificity.
Why add: operational relevance.

### MON-ADD-09
Difficulty: expert
Learning objective: tissue selection
Question: Why can toxin interpretation differ depending on which shellfish tissue is analyzed?
Correct answer: Toxins may be unevenly distributed among tissues and edible portions.
Why add: bridge to food safety and analytical design.

### MON-ADD-10
Difficulty: beginner
Learning objective: pre-harvest prevention
Question: What is the ultimate public-health purpose of marine biotoxin monitoring?
Correct answer: To prevent contaminated seafood from reaching consumers.
Why add: simple but strong learning anchor.

---

# Category 5 — Environmental Drivers

## Existing overlap / duplicate check
Already covered:
- eutrophication definition
- N and P as main nutrients
- climate change generally increases HAB risk
- warm nutrient-rich stagnant water favors cyanoHABs
- P limitation in freshwater
- upwelling
- stratification favors dinoflagellates/cyanobacteria
- ballast water
- GEOHAB stratified/cyst system framing
- Redfield deviation and nutrient limitation
- ocean acidification species-specific effects
- allelopathy

Do **not** re-add those.

## Recommended actions
- **REPLACE** overly simplistic climate-change wording in beginner items
- **ADD** mechanistic, non-deterministic questions

## Proposed replacements

### ENV-REPLACE-01
Replace current `env-b-003`
Reason: current wording is broadly correct but still too one-directional.
Revised concept:
Question: Which statement best describes the relationship between climate change and HABs?
Correct answer: Climate change can increase HAB risk in some regions and taxa by altering temperature, stratification, runoff, and circulation, but effects are species- and region-specific.
Reference: Wells et al. 2015.

## Proposed additions

### ENV-ADD-01
Difficulty: intermediate
Learning objective: avoid single-cause framing
Question: Why is the statement “climate change causes HABs” scientifically incomplete?
Correct answer: Because HAB outcomes reflect interacting physical, chemical, and biological controls that vary by taxon and region.
Why add: very important scientific nuance.

### ENV-ADD-02
Difficulty: intermediate
Learning objective: nutrient form matters
Question: Why can the chemical form of nitrogen matter for HAB development, not just total nitrogen load?
Correct answer: Different taxa differ in their ability to use nitrate, ammonium, urea, and other forms.
Why add: major ecology gap.

### ENV-ADD-03
Difficulty: intermediate
Learning objective: runoff and rainfall
Question: How can extreme rainfall events promote some coastal HABs?
Correct answer: By increasing runoff, nutrient loading, salinity shifts, and hydrological retention changes.
Why add: links climate to mechanism.

### ENV-ADD-04
Difficulty: expert
Learning objective: top-down controls
Question: Why are grazing and loss processes important in HAB ecology?
Correct answer: Bloom formation depends on both growth and losses to grazers, pathogens, and physical export.
Why add: absent.

### ENV-ADD-05
Difficulty: expert
Learning objective: benthic habitat controls
Question: Why can reef degradation and macroalgal change influence ciguatera-associated benthic HAB risk?
Correct answer: Because benthic dinoflagellates depend on substrate and habitat structure that shape colonization opportunities.
Why add: strong benthic HAB concept.

### ENV-ADD-06
Difficulty: beginner
Learning objective: mechanism of upwelling importance
Question: Why can productive upwelling systems support both fisheries and HAB events?
Correct answer: Because nutrient-rich waters stimulate high primary production, including harmful taxa under the right conditions.
Why add: more ecological than the existing definition item.

### ENV-ADD-07
Difficulty: expert
Learning objective: stratification nuance
Question: Why can stronger stratification favor some HAB taxa but disadvantage others?
Correct answer: Because motile or buoyant taxa benefit, whereas taxa relying on mixing may lose access to optimal light/nutrient conditions.
Why add: richer than the current version.

### ENV-ADD-08
Difficulty: intermediate
Learning objective: multi-driver thinking
Question: Which combination best captures common anthropogenic drivers of HAB intensification in coastal systems?
Correct answer: Nutrient enrichment, hydrological alteration, warming, and species transport.
Why add: synthesis.

### ENV-ADD-09
Difficulty: expert
Learning objective: management implication
Question: Why does reducing nutrient load not always immediately eliminate HAB risk?
Correct answer: Because legacy nutrients, cyst beds, hydrodynamics, and climate conditions can sustain risk even after reductions.
Why add: policy-relevant.

### ENV-ADD-10
Difficulty: intermediate
Learning objective: bloom composition vs biomass
Question: Why does a nutrient-driven increase in total algal biomass not necessarily produce a HAB?
Correct answer: Because harmful dominance depends on species composition, physiology, and ecological interactions, not biomass alone.
Why add: key concept.

---

# Category 6 — Human Health & Food Safety

## Existing overlap / duplicate check
Already covered:
- no antidote for PSP
- shellfish look/taste/smell normal
- seek medical attention immediately
- Codex Alimentarius Commission
- EU OA-group limit 160 µg/kg
- ARfD concept
- hippocampal injury in ASP
- WHO 1 µg/L microcystin-LR guideline
- EFSA concern on OA/YTX limits
- California sea lions and domoic acid
- depuration
- IOC-HAB programme capacity building
- Toledo 2014 microcystin crisis

Do **not** re-add those.

## Recommended actions
Mostly **ADD** around traceability, underreporting, vulnerable groups, and advisory logic.

## Proposed additions

### HS-ADD-01
Difficulty: beginner
Learning objective: prevention logic
Question: Why are harvest-area closure systems central to marine biotoxin food safety?
Correct answer: Because prevention before sale is more reliable than consumer detection or preparation.
Why add: strong foundational public-health concept.

### HS-ADD-02
Difficulty: intermediate
Learning objective: jurisdiction-aware regulation
Question: Why should marine biotoxin regulatory questions specify the jurisdiction or framework (e.g. Codex vs EU)?
Correct answer: Because limits, matrices, and enforcement details can differ across systems.
Why add: important for scientific precision.

### HS-ADD-03
Difficulty: intermediate
Learning objective: underreporting
Question: Why are official case counts for marine biotoxin poisoning often underestimates?
Correct answer: Many cases are mild, misdiagnosed, unreported, or not laboratory confirmed.
Why add: currently absent.

### HS-ADD-04
Difficulty: intermediate
Learning objective: traceability
Question: Why is seafood traceability important after a suspected HAB-related poisoning event?
Correct answer: It enables source attribution, targeted recalls, and more effective public-health response.
Why add: absent and policy relevant.

### HS-ADD-05
Difficulty: beginner
Learning objective: advisory communication
Question: What is the main purpose of public seafood advisories during HAB events?
Correct answer: To communicate actionable risk information to harvesters, vendors, clinicians, and consumers.
Why add: absent.

### HS-ADD-06
Difficulty: intermediate
Learning objective: vulnerable populations
Question: Why are children, elderly people, and those with pre-existing disease often emphasized in toxin-risk communication?
Correct answer: They may be more vulnerable to dehydration, respiratory compromise, or other complications.
Why add: useful public-health framing.

### HS-ADD-07
Difficulty: expert
Learning objective: chronic/subacute exposure relevance
Question: Why do repeated low-level toxin exposures remain important even when acute poisonings are rare?
Correct answer: Because chronic and subacute effects remain uncertain but relevant for risk assessment and management.
Why add: absent.

### HS-ADD-08
Difficulty: intermediate
Learning objective: medical management
Question: Why is early respiratory assessment especially important in suspected PSP cases?
Correct answer: Because respiratory failure can develop rapidly and supportive ventilation can be lifesaving.
Why add: strengthens treatment logic.

### HS-ADD-09
Difficulty: expert
Learning objective: regulatory conservatism
Question: Why are regulatory action levels generally set conservatively rather than near overt-poisoning thresholds?
Correct answer: To protect high consumers and sensitive populations under uncertainty.
Why add: strong risk-assessment concept.

### HS-ADD-10
Difficulty: beginner
Learning objective: seafood normality plus prevention
Question: If contaminated shellfish cannot be recognized by consumers, what is the main protection mechanism?
Correct answer: Official monitoring and management programmes.
Why add: only add if duplicate scan judges it sufficiently distinct from the sensory-evaluation question.

---

# Category 7 — Species Identification

## Existing overlap / duplicate check
Current file is empty.
This is a genuine new category.

## Recommended actions
Add this category in a controlled way with image-ready metadata. Do not deploy with empty image paths.

## Implementation notes
Each species-identification item should support:
- `type: "image"` or `type: "image_choice"`
- `image`
- optional answer-level `image`
- `altText`
- `sourceShort`
- `references`
- `learningObjective`
- `lastReviewed`

## Proposed starter set (concept-level)
These should only be added once appropriate image assets and rights/attribution are ready.

### SID-ADD-01
Difficulty: beginner
Question concept: Identify the genus Pseudo-nitzschia from a pennate chain-forming diatom micrograph.
Correct answer: Pseudo-nitzschia.

### SID-ADD-02
Difficulty: beginner
Question concept: Identify Alexandrium from armored dinoflagellate morphology.
Correct answer: Alexandrium.

### SID-ADD-03
Difficulty: intermediate
Question concept: Distinguish Karenia from Alexandrium in comparative image choices.
Correct answer: Karenia.

### SID-ADD-04
Difficulty: intermediate
Question concept: Identify Gambierdiscus as a benthic dinoflagellate relevant to ciguatera.
Correct answer: Gambierdiscus.

### SID-ADD-05
Difficulty: intermediate
Question concept: Identify Dinophysis from its characteristic outline.
Correct answer: Dinophysis.

### SID-ADD-06
Difficulty: expert
Question concept: Which identification problem often requires SEM or molecular support rather than light microscopy alone?
Correct answer: Pseudo-nitzschia species-level identification.

### SID-ADD-07
Difficulty: intermediate
Question concept: Which displayed organism is a diatom rather than a dinoflagellate?
Correct answer: the Pseudo-nitzschia image.

### SID-ADD-08
Difficulty: intermediate
Question concept: Which organism shown is most associated with azaspiracid production?
Correct answer: Azadinium.

### SID-ADD-09
Difficulty: expert
Question concept: Which displayed taxon is most likely benthic/epiphytic rather than planktonic?
Correct answer: the Gambierdiscus-like image.

### SID-ADD-10
Difficulty: beginner
Question concept: Which image shows a cyanobacterial bloom-former rather than a marine dinoflagellate?
Correct answer: the cyanobacterial image.

---

## JSON update rules for the coding agent

For every updated or added question:
- add `references`
- add `sourceShort`
- add `learningObjective`
- add `lastReviewed`
- add `jurisdiction` where the item is regulatory
- keep explanations educational, not just declarative
- avoid duplicate learning objectives inside the same category

Suggested metadata example:
```json
{
  "sourceShort": "EFSA 2009 Saxitoxin group",
  "references": "EFSA. 2009. Marine biotoxins in shellfish – Saxitoxin group. doi:10.2903/j.efsa.2009.1019",
  "learningObjective": "Distinguish receptor blockade by saxitoxins from receptor activation/modulation by brevetoxins.",
  "lastReviewed": "2026-03-25"
}
```

---

## Priority order for implementation
1. monitoring
2. shellfish_poisoning
3. environment
4. organisms
5. toxin_chemistry
6. health_safety
7. species_id

This order is recommended because the regulatory and method questions have the strongest source backbone and the easiest duplicate filtering.

---

## Final QA checklist for the coding agent
- [ ] duplicate / near-duplicate scan completed
- [ ] all updated questions have references and learning objectives
- [ ] regulatory questions specify the framework when relevant
- [ ] climate questions avoid simplistic deterministic wording
- [ ] no empty species-identification records are added without image assets
- [ ] explanation text teaches a principle, not only the answer
