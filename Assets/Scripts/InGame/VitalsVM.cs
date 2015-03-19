using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour
{

	public GameObject healthBar;
	public GameObject staminaBar;
	public GameObject xpBar;
	private Text healthText;
	private Text staminaText;
	private Text xpText;
	private Slider healthSlider;
	private Slider staminaSlider;
	private Slider xpSlider;
	private DinoController dino_controller;
	bool ready = false;
	// Use this for initialization
	public void Initialize ()
	{
		healthSlider = healthBar.GetComponent<Slider> ();
		staminaSlider = staminaBar.GetComponent<Slider> ();
		xpSlider = xpBar.GetComponent<Slider> ();
		healthText = healthBar.GetComponentInChildren<Text> ();
		staminaText = staminaBar.GetComponentInChildren<Text> ();
		xpText = xpBar.GetComponentInChildren<Text> ();
		dino_controller = GameObject.FindGameObjectWithTag ("Player").GetComponent<DinoController> ();
		ready = true;
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (ready) {
			Dinosaur d = dino_controller.GetDinosaur ();
			float currhp = d.Current_HP ();
			float currstam = d.Current_Stamina ();
			float maxhp = d.Max_HP ();
			float maxstam = d.Max_Stamina ();
			float currxp = d.Current_XP ();
			float nextxp = d.Next_XP_Goal ();
			healthSlider.value = currhp / maxhp;
			staminaSlider.value = currstam / maxstam;
			xpSlider.value = currxp / nextxp;
			healthText.text = ((int)currhp).ToString () + "/" + ((int)maxhp).ToString () + (d.Current_HP () == d.Max_HP () ? "" : "  (+" + d.HP_Regen () + ")");
			staminaText.text = ((int)currstam).ToString () + "/" + ((int)maxstam).ToString () + (d.Current_Stamina () == d.Max_Stamina () ? "" : "  (+" + d.Stamina_Regen () + ")");
			xpText.text = ((int)currxp).ToString () + "/" + ((int)nextxp).ToString ();
		}
	}
}

