---
title: "From Pipette to Pipeline — How AI and Open-Source Tools Are Changing Lab Data Analysis"
date: 2026-01-15
excerpt: "How combining R, Shiny, and AI-assisted development made it possible to automate a full competitive bioassay analysis pipeline — and what this means for bench scientists."
---

When I describe my day-to-day work to non-scientists, the analytical part, including mass spectometry or competitive receptor binding assays tend to register as impressively technical. What surprises people is that historically, a significant portion of the time spent on that work happens not at the instrument, but in a spreadsheet.

Processing competitive binding assay data is a representative example. A Receptor Binding Assay (RBA) for paralytic shellfish toxins involves reading fluorescence or radioactivity from a 96-well plate, fitting a dose-response curve, calculating inhibitory concentrations, and producing a formatted report. Ideally, this report conforms to regulatory expectations and is reproducible by another analyst in another laboratory. Done carefully by hand in Excel, this process is slow, error-prone, and hard to audit. Done badly, it introduces systematic errors that propagate silently into monitoring decisions.

This problem is not unique to biotoxin analysis. It recurs across analytical laboratory science wherever routine data processing sits between raw instrument output and a decision that matters.

## Where R and AI enter the picture

Over the past year I have been developing an R Shiny application that automates the processing pipeline for competitive binding assay data covering RBA analyses for saxitoxin, brevetoxin, and ciguatoxin, as well as ELISA-based assays for cortisol, testosterone, and estradiol. The application ingests raw plate reader exports in multiple formats, fits four-parameter logistic dose-response curves, detects outliers, computes concentrations, and generates bilingual (English/Spanish) HTML and Word reports with configurable confidence intervals.

What made this buildable in a reasonable timeframe, alongside a full-time research and coordination role, was the combination of R as a computational and visualisation environment with AI-assisted development. I will be direct about this: significant parts of the application architecture, the UI logic, and the report templates were developed iteratively using Claude as a coding assistant. Not as a replacement for understanding what the code does but as an accelerator for the translation of that understanding into working software.

This combination is worth naming because it has materially changed what a single bench scientist can build and maintain. A Shiny application that performs validated curve fitting, handles multiple instrument output formats, and generates structured reports would previously have required either a dedicated programmer or a substantial time investment that most research environments cannot afford. That barrier is lower now.

## What the application does

The application is openly available on GitHub and can be run directly from R with a single command. It handles the following:

- Automatic detection and parsing of plate reader output formats (.xlsx, .csv, .txt)
- Four-parameter logistic dose-response fitting with configurable bounds
- Per-replicate outlier detection and flagging
- Conversion of raw signal to toxin-equivalent concentrations using configurable TEFs
- Configurable regulatory threshold comparison
- Bilingual HTML and Word report output

It was developed in collaboration with Arnold Molina Porras at the University of Costa Rica and reflects the practical needs of laboratories operating RBA programmes within the IAEA's Member State network.

## A broader point

The tools for automating routine analytical workflows are accessible in a way they were not five years ago. R is free, extensively documented, and has a mature ecosystem for statistical computing and data visualisation. Shiny makes it possible to package analysis pipelines into browser-based applications that do not require the end user to write any code. AI coding assistants reduce the gap between knowing what you want to compute and being able to write the code to do it.

For bench scientists who work with repeated analytical workflows, the investment in learning enough R to build these pipelines is likely to pay back many times over. The starting point does not need to be sophisticated. A script that reads your plate reader output, fits a curve, and saves a plot is already a meaningful improvement over manual transcription.

[Shiny App — Competitive Bioassays on GitHub](https://github.com/KristofM854/Shiny-App-Competitive-Bioassays)
