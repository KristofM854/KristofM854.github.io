---
title: "The Same Data, Differently Seen — Why Your Choice of Visualisation Matters"
date: 2026-02-10
excerpt: "Boxplots can be identical while hiding completely different data distributions. A practical guide to choosing visualisations that reveal rather than conceal."
---

There is a famous demonstration in statistics known as Anscombe's Quartet, which is composed of four datasets that share identical summary statistics (mean, variance, correlation coefficient, linear regression line) but look completely different when plotted. The point is a simple one: summary statistics can be identical while the underlying data structures diverge in ways that matter.

Boxplots are the scientific equivalent of this problem for a large fraction of ecological and biological datasets. They are everywhere in published papers, universally understood, and capable of hiding almost everything that is interesting about your data.

## What a boxplot actually shows

A boxplot displays five values: the median, the 25th and 75th percentiles (the box), and the whiskers (typically extending to 1.5 times the interquartile range), with outliers shown individually beyond that. It tells you nothing about sample size, nothing about modality, and nothing about where the data actually cluster within those quartile boundaries.

This becomes a real problem when two datasets have identical or near-identical boxplot appearances despite having very different data distributions underneath.

Consider a simple example. Take two groups, each with the same median, same interquartile range, and same whisker extent. One group has a unimodal, roughly symmetric distribution. The other is bimodal meaning that data cluster near the lower and upper quartile boundaries with a gap in the middle. A boxplot of both groups looks the same. The underlying biology, or toxicology, or whatever your measurement reflects, is completely different.

## Why this matters in practice

In my own field — monitoring data for harmful algal blooms and biotoxins — this issue comes up regularly. Cell abundance data is often log-distributed with a heavy right tail, occasional extreme events, and many near-zero observations. A boxplot of such data across stations or seasons will show tight boxes with long upper whiskers, but will not reveal whether the variability is driven by a few extreme bloom events or by consistent moderate elevations. Those two scenarios have very different management implications.

Similarly, when comparing toxin concentrations across treatment groups in a bioassay, a boxplot obscures whether the response is homogeneous across replicates or driven by a subset of outliers that happen to fall within the whisker range.

## Better alternatives, depending on context

The right choice depends on your sample size and your question. For small datasets (n < 30), showing all data points directly, for instance as a dot plot, is almost always better. There is no reason to summarise five or ten observations.

For moderate sample sizes, a combination approach works well: violin plots or kernel density estimates for distributional shape, overlaid with a boxplot or individual points for the quantile summary. This is now straightforward to produce in ggplot2 using `geom_violin()` + `geom_boxplot()` with appropriate width adjustments.

For large datasets where individual points would overprint, ridge plots (via the ggridges package) are effective for comparing distributions across many groups. Beeswarm plots are useful when you want to show individual points without overplotting in moderate samples.

## A note on ggplot2

All of the visualisation approaches mentioned here are straightforward to implement in ggplot2. For anyone working in R who currently defaults to boxplots out of habit, the jump to violin + jitter or ridge plots is a few lines of code. The [ggridges](https://wilkelab.org/ggridges/) and [ggbeeswarm](https://github.com/eclarke/ggbeeswarm) packages are both on CRAN and well-documented.
