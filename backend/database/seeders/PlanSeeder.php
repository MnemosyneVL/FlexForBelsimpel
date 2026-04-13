<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Phone;
use App\Models\PhonePlan;
use App\Models\Provider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seeds phone plans from Dutch telecom providers and creates phone+plan combinations.
 *
 * The plans are inspired by real Dutch market offerings but with simplified pricing.
 * Each provider has a range from budget to premium plans.
 *
 * After creating plans, we generate phone+plan combinations with calculated pricing.
 * The pricing model is simplified: more expensive plans = lower upfront phone cost,
 * which is how Dutch telecom works (the phone cost is "spread" over the monthly fee).
 */
class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $providers = Provider::all()->keyBy('slug');

        $plans = [
            // --- KPN (premium provider, higher prices, best network) ---
            ['provider' => 'kpn', 'name' => 'KPN 5GB', 'monthly_cost_eur' => 18.00, 'data_gb' => 5, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'kpn', 'name' => 'KPN 15GB', 'monthly_cost_eur' => 25.00, 'data_gb' => 15, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],
            ['provider' => 'kpn', 'name' => 'KPN 40GB', 'monthly_cost_eur' => 35.00, 'data_gb' => 40, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],
            ['provider' => 'kpn', 'name' => 'KPN Unlimited', 'monthly_cost_eur' => 45.00, 'data_gb' => null, 'is_unlimited_data' => true, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],

            // --- VODAFONE ---
            ['provider' => 'vodafone', 'name' => 'Vodafone Start', 'monthly_cost_eur' => 16.50, 'data_gb' => 5, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'vodafone', 'name' => 'Vodafone Red', 'monthly_cost_eur' => 27.50, 'data_gb' => 20, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],
            ['provider' => 'vodafone', 'name' => 'Vodafone Red Unlimited', 'monthly_cost_eur' => 42.50, 'data_gb' => null, 'is_unlimited_data' => true, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],

            // --- T-MOBILE ---
            ['provider' => 't-mobile', 'name' => 'T-Mobile Basis', 'monthly_cost_eur' => 15.00, 'data_gb' => 2, 'minutes' => 200, 'sms' => 50, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 't-mobile', 'name' => 'T-Mobile Go', 'monthly_cost_eur' => 22.00, 'data_gb' => 10, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 't-mobile', 'name' => 'T-Mobile Unlimited', 'monthly_cost_eur' => 38.00, 'data_gb' => null, 'is_unlimited_data' => true, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],

            // --- TELE2 (budget-friendly) ---
            ['provider' => 'tele2', 'name' => 'Tele2 5GB', 'monthly_cost_eur' => 13.00, 'data_gb' => 5, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'tele2', 'name' => 'Tele2 15GB', 'monthly_cost_eur' => 20.00, 'data_gb' => 15, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'tele2', 'name' => 'Tele2 Unlimited', 'monthly_cost_eur' => 32.00, 'data_gb' => null, 'is_unlimited_data' => true, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 24],

            // --- SIMPEL (cheapest, no-frills) ---
            ['provider' => 'simpel', 'name' => 'Simpel 2GB', 'monthly_cost_eur' => 8.00, 'data_gb' => 2, 'minutes' => 150, 'sms' => 50, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'simpel', 'name' => 'Simpel 5GB', 'monthly_cost_eur' => 12.00, 'data_gb' => 5, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],
            ['provider' => 'simpel', 'name' => 'Simpel 10GB', 'monthly_cost_eur' => 16.00, 'data_gb' => 10, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 24],

            // --- 12-MONTH CONTRACTS (less common but they exist) ---
            ['provider' => 'kpn', 'name' => 'KPN 10GB Flex', 'monthly_cost_eur' => 22.00, 'data_gb' => 10, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '4G', 'contract_months' => 12],
            ['provider' => 'vodafone', 'name' => 'Vodafone Red 12M', 'monthly_cost_eur' => 30.00, 'data_gb' => 20, 'minutes' => null, 'sms' => null, 'is_unlimited_calls' => true, 'network_type' => '5G', 'contract_months' => 12],
        ];

        foreach ($plans as $planData) {
            $providerSlug = $planData['provider'];
            unset($planData['provider']);

            // Set defaults for optional boolean fields
            $planData['is_unlimited_data'] = $planData['is_unlimited_data'] ?? false;
            $planData['is_unlimited_calls'] = $planData['is_unlimited_calls'] ?? false;

            Plan::create(array_merge($planData, [
                'provider_id' => $providers[$providerSlug]->id,
                'slug' => Str::slug($planData['name']),
            ]));
        }

        // Now create phone+plan combinations with calculated pricing.
        // This is the core of the comparison feature.
        $this->seedPhonePlans();
    }

    /**
     * Generate phone+plan combinations with realistic pricing.
     *
     * The pricing logic: the phone's SIM-free price gets spread across the contract.
     * Higher monthly plan = more of the phone cost is absorbed → lower upfront cost.
     * Budget plans = you pay more upfront for the phone.
     */
    private function seedPhonePlans(): void
    {
        $phones = Phone::all();
        $plans = Plan::with('provider')->get();

        foreach ($phones as $phone) {
            foreach ($plans as $plan) {
                // Calculate how much of the phone cost the plan absorbs.
                // More expensive plans subsidize more of the phone cost.
                // This ratio determines the upfront vs monthly split.
                $planPriceRatio = $plan->monthly_cost_eur / 50; // 50€ plan = 100% subsidy
                $subsidyRate = min($planPriceRatio, 1.0); // Cap at 100%

                // Phone cost that needs to be covered
                $phonePrice = (float) $phone->price_eur;

                // Upfront cost decreases as plan price increases
                $upfrontCost = round($phonePrice * (1 - $subsidyRate * 0.85), 2);
                // Minimum upfront is €0, maximum is the phone price
                $upfrontCost = max(0, min($upfrontCost, $phonePrice));

                // The remaining phone cost is spread across monthly payments
                $remainingPhoneCost = $phonePrice - $upfrontCost;
                $monthlyPhoneAddon = round($remainingPhoneCost / $plan->contract_months, 2);

                // Total monthly = plan cost + phone installment
                $monthlyCost = round((float) $plan->monthly_cost_eur + $monthlyPhoneAddon, 2);

                // Total cost over the full contract period
                $totalCost = round($upfrontCost + ($monthlyCost * $plan->contract_months), 2);

                PhonePlan::create([
                    'phone_id' => $phone->id,
                    'plan_id' => $plan->id,
                    'monthly_cost_eur' => $monthlyCost,
                    'upfront_cost_eur' => $upfrontCost,
                    'total_cost_eur' => $totalCost,
                ]);
            }
        }
    }
}
